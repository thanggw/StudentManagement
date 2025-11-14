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

const { Option } = Select;

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithDates[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserWithDates | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Kiểm tra admin + load users
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser.roles?.includes("admin")) {
          message.warning("Access denied");
          router.push("/dashboard/students");
          return;
        }

        const data = await getAllUsers();
        setUsers(data.filter((u) => !u.deleted));
      } catch (error: any) {
        message.error(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
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
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
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
        pagination={{ pageSize: 10 }}
      />

      {/* Modal chỉnh sửa role */}
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
