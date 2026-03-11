"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Search,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Mail,
  User,
  Shield,
  Users,
  UserCheck,
  UserX,
  ChevronDown,
} from "lucide-react";
import { userRepository } from "@/lib/api/users";
import { RoleBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import {
  createUserSchema,
  type CreateUserFormData,
} from "@/lib/validators/schemas";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { Role, User as UserType } from "@/types";

const ROLE_OPTIONS = [
  { value: "APPLICANT", label: "Applicant" },
  { value: "HR", label: "HR Manager" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const AVATAR_COLOR: Record<Role, string> = {
  APPLICANT: "from-green-500  to-green-700",
  HR: "from-sky-500    to-sky-700",
  SUPER_ADMIN: "from-amber-500  to-amber-700",
};

function SummaryPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border",
        color,
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs opacity-70 leading-none mb-0.5">{label}</p>
        <p className="text-xl font-display font-bold leading-none">{value}</p>
      </div>
    </div>
  );
}

function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { success: ok, error: err } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "APPLICANT" },
  });

  const mutation = useMutation({
    mutationFn: userRepository.create,
    onSuccess: () => {
      ok("User Created", "New account created.");
      reset();
      onSuccess();
      onClose();
    },
    onError: (e: { message?: string }) => err("Failed", e.message),
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New User"
      description="Fill in the details to add a system account."
      size="md"
    >
      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.firstName?.message}
            required
            {...register("firstName")}
          />
          <Input
            label="Last Name"
            error={errors.lastName?.message}
            required
            {...register("lastName")}
          />
        </div>
        <Input
          label="Email"
          type="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          required
          {...register("email")}
        />
        <Select
          label="Role"
          options={ROLE_OPTIONS}
          error={errors.role?.message}
          required
          {...register("role")}
        />
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          required
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword?.message}
          required
          {...register("confirmPassword")}
        />
        <div className="flex gap-3 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({
  user,
  isDeleting,
  onConfirm,
  onClose,
}: {
  user: UserType | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!user) return null;
  return (
    <Modal isOpen={!!user} onClose={onClose} title="Delete User" size="sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
          <Trash2 className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <p className="text-sm text-surface-700 leading-relaxed">
            Permanently delete{" "}
            <span className="font-semibold text-surface-900">
              {user.firstName} {user.lastName}
            </span>
            ? This cannot be undone.
          </p>
          <p className="text-xs text-surface-400 mt-1">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          isLoading={isDeleting}
          onClick={onConfirm}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}

function UsersContent() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", { search, role: roleFilter }],
    queryFn: () =>
      userRepository.getAll({
        search: search || undefined,
        role: roleFilter || undefined,
      }),
    placeholderData: (p) => p,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  // Toggle active / inactive
  const toggleMutation = useMutation({
    mutationFn: userRepository.toggleStatus,
    onSuccess: (updated) => {
      invalidate();
      success(
        updated.isActive ? "User Activated" : "User Deactivated",
        `${updated.firstName} ${updated.lastName} is now ${updated.isActive ? "active" : "inactive"}.`,
      );
    },
    onError: () => toastError("Error", "Failed to update status."),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: userRepository.delete,
    onSuccess: () => {
      invalidate();
      success("Deleted", "User account removed.");
      setDeleteTarget(null);
    },
    onError: () => toastError("Error", "Failed to delete user."),
  });

  const users = data?.data ?? [];
  const total = data?.total ?? 0;
  const active = users.filter((u) => u.isActive).length;
  const inactive = users.filter((u) => !u.isActive).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">
              Manage system accounts, roles and access
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryPill
          icon={<Users className="w-4 h-4 text-green-700" />}
          label="Total Users"
          value={total}
          color="border-green-200 bg-green-50 text-green-900"
        />
        <SummaryPill
          icon={<UserCheck className="w-4 h-4 text-sky-700" />}
          label="Active"
          value={active}
          color="border-sky-200   bg-sky-50   text-sky-900"
        />
        <SummaryPill
          icon={<UserX className="w-4 h-4 text-amber-700" />}
          label="Inactive"
          value={inactive}
          color="border-amber-200 bg-amber-50 text-amber-900"
        />
        <SummaryPill
          icon={<Shield className="w-4 h-4 text-rose-700" />}
          label="Admins"
          value={users.filter((u) => u.role === "SUPER_ADMIN").length}
          color="border-rose-200 bg-rose-50 text-rose-900"
        />
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | "")}
              options={[{ value: "", label: "All Roles" }, ...ROLE_OPTIONS]}
              leftIcon={<Shield className="w-4 h-4" />}
            />
          </div>
        </div>
        {(search || roleFilter) && (
          <p className="text-xs text-surface-400 mt-2">
            Showing{" "}
            <span className="font-semibold text-surface-700">
              {users.length}
            </span>{" "}
            result{users.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50/50">
                {[
                  "User",
                  "Role",
                  "Status",
                  "Joined",
                  "Last Login",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "px-6 py-3.5 text-xs font-semibold text-surface-500 uppercase tracking-wider",
                      i === 5 ? "text-right" : "text-left",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-surface-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    index={i}
                    isToggling={toggleMutation.isPending}
                    onToggle={() => toggleMutation.mutate(user.id)}
                    onDelete={() => setDeleteTarget(user)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={invalidate}
      />
      <DeleteModal
        user={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

interface UserRowProps {
  user: UserType;
  index: number;
  isToggling: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function UserRow({
  user,
  index,
  isToggling,
  onToggle,
  onDelete,
}: UserRowProps) {
  return (
    <tr
      className="hover:bg-surface-50/50 transition-colors animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* User */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
              AVATAR_COLOR[user.role],
            )}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-surface-400">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <Badge variant={user.isActive ? "success" : "default"}>
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      </td>

      {/* Joined */}
      <td className="px-6 py-4">
        <p className="text-xs text-surface-500">{formatDate(user.createdAt)}</p>
      </td>

      {/* Last login */}
      <td className="px-6 py-4">
        <p className="text-xs text-surface-500">
          {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Never"}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          {/* Activate / Deactivate */}
          <button
            onClick={onToggle}
            disabled={isToggling}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border",
              user.isActive
                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
              "disabled:opacity-50",
            )}
            title={user.isActive ? "Deactivate user" : "Activate user"}
          >
            {user.isActive ? (
              <>
                <ToggleRight className="w-3.5 h-3.5" /> Deactivate
              </>
            ) : (
              <>
                <ToggleLeft className="w-3.5 h-3.5" /> Activate
              </>
            )}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-surface-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminUsersPage() {
  return (
    <ToastProvider>
      <UsersContent />
    </ToastProvider>
  );
}
