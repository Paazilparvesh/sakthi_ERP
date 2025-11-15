import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, UserPlus, Pencil, Trash2, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type RoleType = "inward" | "programer" | "qa" | "admin" | "accountent";

interface UserItem {
  id: number;
  username: string;
  email: string;
  role_type: RoleType;
}

interface UserForm {
  username: string;
  email: string;
  password?: string;
  role_type: RoleType | "";
}

interface RoleCountResponse {
  count_inward: number;
  count_programer: number;
  count_QA: number;
  count_accountent: number;
  count_admin: number;
  total_users: number;
}

const ROLES: { value: RoleType; label: string }[] = [
  { value: "inward", label: "Inward" },
  { value: "programer", label: "Programer" },
  { value: "qa", label: "QA" },
  { value: "accountent", label: "Accountant" },
  { value: "admin", label: "Admin" },
];

const PAGE_SIZE = 10;

const AdminUsersAdvanced: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | RoleType | "all">("");
  const [sortBy, setSortBy] = useState<"username" | "email" | "role_type">("username");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selected, setSelected] = useState<UserItem | null>(null);
  const [processing, setProcessing] = useState(false);

  const [roleCount, setRoleCount] = useState<RoleCountResponse | null>(null);


  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/get_role_count/`);
        if (!response.ok) throw new Error("Failed to fetch counts");

        const data: RoleCountResponse = await response.json();
        setRoleCount(data);
      } catch (error) {
        toast({
          title: "Fetch Failed",
          description: "Unable to load role counts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoleCounts();
  }, [API_URL, toast]);

  /* ----------- ADD FORM ----------- */
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<UserForm>({
    defaultValues: { username: "", email: "", password: "", role_type: "" },
  });

  /* ----------- EDIT FORM ----------- */
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<UserForm>({
    defaultValues: { username: "", email: "", password: "", role_type: "" },
  });

  /* ----------- FETCH USERS (matches backend) ----------- */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${API_URL}/api/get_all_users/`);
      const json = await resp.json();

      if (!resp.ok) throw new Error(json?.msg || "Failed to load users");

      setUsers(json.data || []);
    } catch (err) {
      toast({ variant: "destructive", title: "Error loading users", description: String(err) });
    } finally {
      setLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]);

  /* ----------- FILTER + SORT + PAGINATION ----------- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...users];

    if (roleFilter && roleFilter !== "all") {
      out = out.filter((u) => u.role_type === roleFilter);
    }

    if (q) {
      out = out.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role_type.toLowerCase().includes(q)
      );
    }

    out.sort((a, b) => {
      const aKey = String(a[sortBy] ?? "").toLowerCase();
      const bKey = String(b[sortBy] ?? "").toLowerCase();
      if (aKey < bKey) return sortDir === "asc" ? -1 : 1;
      if (aKey > bKey) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return out;
  }, [users, query, roleFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: "username" | "email" | "role_type") => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  /* ----------- CREATE USER (matches backend /create_user/) ----------- */
  const onAdd = async (data: UserForm) => {
    setProcessing(true);
    try {
      const resp = await fetch(`${API_URL}/api/create_user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await resp.json();
      if (!resp.ok) throw new Error(json.msg);

      setRefreshKey((k) => k + 1);
      resetAdd();
      setAddOpen(false);

      toast({ title: "User created successfully" });
    } catch (err) {
      toast({ variant: "destructive", title: "Create failed", description: String(err) });
    } finally {
      setProcessing(false);
    }
  };

  /* ----------- OPEN EDIT ----------- */
  const onOpenEdit = (u: UserItem) => {
    setSelected(u);
    resetEdit({
      username: u.username,
      email: u.email,
      password: "",
      role_type: u.role_type,
    });
    setEditOpen(true);
  };

  /* ----------- UPDATE USER (matches /update_user/<id>/) ----------- */
  const onEdit = async (data: UserForm) => {
    if (!selected) return;

    setProcessing(true);
    try {
      const resp = await fetch(`${API_URL}/api/update_user/${selected.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await resp.json();
      if (!resp.ok) throw new Error(json.msg);

      setRefreshKey((k) => k + 1);
      setEditOpen(false);
      setSelected(null);

      toast({ title: "User updated" });
    } catch (err) {
      toast({ variant: "destructive", title: "Update failed", description: String(err) });
    } finally {
      setProcessing(false);
    }
  };

  /* ----------- DELETE USER (matches /delete_user/<id>/) ----------- */
  const onDelete = async () => {
    if (!selected) return;

    setProcessing(true);
    try {
      const resp = await fetch(`${API_URL}/api/delete_user/${selected.id}/`, {
        method: "DELETE",
      });

      const json = await resp.json();
      if (!resp.ok) throw new Error(json.msg);

      setUsers((prev) => prev.filter((x) => x.id !== selected.id));
      setDeleteOpen(false);
      setSelected(null);
      setRefreshKey((k) => k + 1);

      toast({ title: "User deleted" });
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed", description: String(err) });
    } finally {
      setProcessing(false);
    }
  };

  /* ----------- ROLE BADGE ----------- */
  const roleBadge = (r: RoleType) => {
    const map: Record<RoleType, string> = {
      inward: "bg-blue-100 text-blue-800",
      programer: "bg-green-100 text-green-800",
      qa: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800",
      accountent: "bg-orange-100 text-orange-800",
    };
    return map[r];
  };

  /* ----------- RENDER ----------- */
  return (
    <div className="space-y-6">

      {/* Role Count Cards */}
      {roleCount && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Inward", value: roleCount.count_inward, color: "blue" },
              { title: "QA", value: roleCount.count_QA, color: "purple" },
              { title: "Programer", value: roleCount.count_programer, color: "green" },
              { title: "Accountant", value: roleCount.count_accountent, color: "orange" },
              { title: "Admin", value: roleCount.count_admin, color: "red" },
              { title: "Total", value: roleCount.total_users, color: "teal" },
            ].map(({ title, value, color }) => (
              <Card key={title} className={`bg-${color}-50 border border-${color}-200`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{title} Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold text-${color}-700`}>
                    {value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- SEARCH / FILTER / SORT ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-72"
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as RoleType | "all" | "");
              setPage(1);
            }}
            className="rounded-md border px-3 py-2"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>Sort:</span>
            <button onClick={() => toggleSort("username")} className="px-2 py-1 flex gap-1">
              Username <ChevronsUpDown className="w-4 h-4" />
            </button>
            <button onClick={() => toggleSort("email")} className="px-2 py-1 flex gap-1">
              Email <ChevronsUpDown className="w-4 h-4" />
            </button>
            <button onClick={() => toggleSort("role_type")} className="px-2 py-1 flex gap-1">
              Role <ChevronsUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------- ADD USER ---------------- */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> New User
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddSubmit(onAdd)} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input {...registerAdd("username", { required: "Required" })} disabled={processing} />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  {...registerAdd("email", {
                    required: "Required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                  })}
                  disabled={processing}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  {...registerAdd("password", { required: "Required" })}
                  disabled={processing}
                />
              </div>

              <div>
                <Label>Role</Label>
                <select
                  {...registerAdd("role_type", { required: "Required" })}
                  className="w-full border rounded px-3 py-2"
                  disabled={processing}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)} disabled={processing}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ---------------- USER TABLE ---------------- */}
      <Card className="overflow-x-auto">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-center border">
                <th className="px-4 py-3 border">S.no.</th>
                <th className="px-4 py-3 border">Username</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Role</th>
                <th className="px-4 py-3 border w-[15%]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                pageData.map((u, idx) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50 text-center">
                    <td className="px-4 py-3 border">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-3 border">{u.username}</td>
                    <td className="px-4 py-3 border">{u.email}</td>
                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${roleBadge(u.role_type)}`}
                      >
                        {u.role_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 border">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => onOpenEdit(u)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => { setSelected(u); setDeleteOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-end items-center mt-4 text-sm">

        <div className="flex items-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <div className="px-3 py-1 border rounded">
            {page} / {totalPages}
          </div>
          <Button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>

      {/* ---------------- EDIT DIALOG ---------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit(onEdit)} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input {...registerEdit("username", { required: "Required" })} />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...registerEdit("email", {
                  required: "Required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
                })}
              />
            </div>

            <div>
              <Label>Password (optional)</Label>
              <Input {...registerEdit("password")} type="password" />
            </div>

            <div>
              <Label>Role</Label>
              <select {...registerEdit("role_type", { required: "Required" })} className="w-full border px-3 py-2 rounded">
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)} className="hover:bg-gray-300 hover:text-black">
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------- DELETE DIALOG ---------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Delete</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to delete <strong>{selected?.username}</strong>?
          </p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={processing}
              className="hover:bg-gray-300 hover:text-black"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={processing}>
              {processing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersAdvanced;
