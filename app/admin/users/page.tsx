"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Trash2, Users, Search, Edit } from "lucide-react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setPage(1);
        fetchUsers(value, 1);
      }, 300),
    []
  );

  const fetchUsers = async (query = search, currentPage = page) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/admin/users`, { page: currentPage, search: query });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const openEditModal = async (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
    setIsLoadingModal(true);
    try {
      const [coursesRes, userCoursesRes] = await Promise.all([
        axios.post(`/api/courses`, { timestamp: Date.now() }),
        axios.post(`/api/admin/users/courses`, { timestamp: Date.now(), userId: user.id })
      ]);
      setCourses(coursesRes.data || []);
      setUserCourses(userCoursesRes.data.courseIds || []);
    } catch (error) {
      toast.error("Failed to fetch courses");
      setCourses([]);
    } finally {
      setIsLoadingModal(false);
    }
  };

  const toggleCourse = useCallback((courseId: string) => {
    setUserCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  }, []);

  const saveUserCourses = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    try {
      await axios.post(`/api/admin/users/saveCourse`, { courseIds: userCourses,userId : selectedUser.id });
      toast.success("User courses updated successfully");
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update courses");
    } finally {
      setIsSaving(false);
    }
  };

  const paginationButtons = useMemo(() => (
    <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
      <Button
        onClick={handlePrevPage}
        disabled={page <= 1}
        className={cn(
          "bg-blue-500 hover:bg-blue-600 transition-colors",
          page <= 1 && "opacity-50 cursor-not-allowed"
        )}
      >
        Previous
      </Button>
      <span className="text-gray-700 font-medium dark:text-gray-300">
        Page {page} of {totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={page >= totalPages}
        className={cn(
          "bg-blue-500 hover:bg-blue-600 transition-colors",
          page >= totalPages && "opacity-50 cursor-not-allowed"
        )}
      >
        Next
      </Button>
    </div>
  ), [page, totalPages]);

  return (
    <div className="wrapper my-16 flex flex-col p-10 gap-4">
      <section className="my-4 flex items-center gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <Users size={18} />
        <h2 className="text-lg font-semibold">User Management</h2>
      </section>

      <div className="flex justify-end mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearchChange(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 hover:shadow-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : users.length > 0 ? (
        <div className="border-2 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-3">{user.name || "N/A"}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button
                      onClick={() => openEditModal(user)}
                      className="flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <Edit size={16} /> Edit Courses
                    </Button>
                    <Button
                      onClick={() => deleteUser(user.id)}
                      variant="destructive"
                      disabled={isDeleting}
                      className="flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">No users found.</div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900 shadow-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Edit Courses for {selectedUser?.name || 'User'}
            </DialogTitle>
          </DialogHeader>
          {isLoadingModal ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto py-4 px-1">
              {courses.length === 0 ? (
                <p className="text-center text-gray-500 italic">No courses available</p>
              ) : (
                courses.map((course) => (
                  <label
                    key={course.id}
                    className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 hover:shadow-md"
                  >
                    <input
                      type="checkbox"
                      checked={userCourses.includes(course.id)}
                      onChange={() => toggleCourse(course.id)}
                      className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    />
                    <span className="flex-1 text-sm font-semibold tracking-wide">{course.title}</span>
                  </label>
                ))
              )}
            </div>
          )}
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-6 py-2 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </Button>
            <Button
              onClick={saveUserCourses}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white min-w-[100px] rounded-lg px-6 py-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>      {paginationButtons}
    </div>
  );
}
