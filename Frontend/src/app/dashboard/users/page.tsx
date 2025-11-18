"use client";

import { useState } from "react";
import { Table, Button, Modal, Select, message, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import { deleteUser, updateUserRole } from "@/lib/api";
import { UserWithDates } from "@/lib/type";
import { useAuth } from "@/hooks/useAuth";
import { usePaginatedData } from "@/hooks/usePaginatedData";
import { getAllUsers } from "@/lib/api";
import { Roles } from "@/lib/constants";

const { Option } = Select;

export default function UsersPage() {
  useAuth(true);

  const [editingUser, setEditingUser] = useState<UserWithDates | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: users,
    total,
    loading,
    loadData,
    refetchPage1,
  } = usePaginatedData<UserWithDates>({
    fetchFn: getAllUsers,
    pageSize: 10,
  });

  const filteredUsers = users.filter((u) => !u.deleted);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    refetchPage1();
    message.success("User deleted");
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;
    try {
      await updateUserRole(editingUser.id, editingUser.roles);
      refetchPage1();
      setIsModalOpen(false);
      message.success("Role updated");
    } catch (error: any) {
      message.error(error.message || "Failed to update role");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      key: "roles",
      render: (_: any, record: UserWithDates) => (
        <Tag color={record.roles.includes(Roles.ADMIN) ? "red" : "blue"}>
          {record.roles.map((r) => r.toUpperCase()).join(", ")}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserWithDates) => (
        <div className="flex gap-2">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              setIsModalOpen(true);
            }}
          >
            Edit Role
          </Button>
          <Popconfirm
            title="Delete user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <TeamOutlined /> Users Management
        </h2>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize: 10,
          showSizeChanger: false,
          onChange: loadData,
        }}
      />

      <Modal
        title="Edit User Role"
        open={isModalOpen}
        onOk={handleRoleChange}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        {editingUser && (
          <Select
            mode="multiple"
            value={editingUser.roles}
            onChange={(values: Roles[]) => {
              setEditingUser({ ...editingUser, roles: values });
            }}
            style={{ width: "100%" }}
          >
            <Option value={Roles.USER}>User</Option>
            <Option value={Roles.ADMIN}>Admin</Option>
          </Select>
        )}
      </Modal>
    </div>
  );
}
