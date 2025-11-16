"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Select, message, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getCurrentUser,
} from "@/lib/api";
import { UserWithDates } from "@/lib/type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const { Option } = Select;

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithDates[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithDates | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { isAdmin } = useAuth(true);
  const pageSize = 10;

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      const { data, total } = await getAllUsers(undefined, skip, pageSize);
      setUsers(data.filter((u) => !u.deleted));
      setTotal(total);
    } catch (error: any) {
      message.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      loadData(1);
      message.success("User deleted");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;
    try {
      const updated = await updateUserRole(editingUser.id, editingUser.roles);
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setIsModalOpen(false);
      message.success("Role updated");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      key: "roles",
      render: (_: any, record: UserWithDates) => (
        <Tag color={record.roles.includes("admin") ? "red" : "blue"}>
          {record.roles.join(", ")}
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
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          pageSize,
          showSizeChanger: false,
          onChange: (page) => loadData(page),
        }}
      />

      <Modal
        title="Edit User Role"
        open={isModalOpen}
        onOk={handleRoleChange}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
      >
        {editingUser && (
          <Select
            mode="multiple"
            value={editingUser.roles}
            onChange={(values) => {
              setEditingUser({ ...editingUser, roles: values });
            }}
            style={{ width: "100%" }}
            placeholder="Select roles"
          >
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        )}
      </Modal>
    </div>
  );
}
