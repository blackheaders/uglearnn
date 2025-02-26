"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  CreditCard,
  BookOpen,
  Image as ImageIcon,
  X,

  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Notification {
  id: string;
  screenshot: string;
  amount: number;
  status: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
  }
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchLoading, setFetchLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();

  }, [currentPage, statusFilter]);

  const fetchNotifications = async () => {
    setFetchLoading(true);
    try {

      const response = await fetch(`/api/admin/notifications?page=${currentPage}&status=${statusFilter}`);
      const data = await response.json();
      setNotifications(data.notifications);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleApprove = async (notificationId: string) => {

    setActionLoading(notificationId);
    try {
      const response = await fetch(`/api/admin/notifications/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) throw new Error();

      toast.success("Payment approved successfully");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to approve payment");
    } finally {

      setActionLoading(null);
    }
  };

  const handleReject = async (notificationId: string) => {

    setActionLoading(notificationId);
    try {
      const response = await fetch(`/api/admin/notifications/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) throw new Error();

      toast.success("Payment rejected");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to reject payment");
    } finally {

      setActionLoading(null);
    }
  };






  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Notifications</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button

            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-lg px-4 py-2.5 shadow-sm transition-all hover:shadow-md flex items-center gap-2 ${
              statusFilter === "all" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">All</span>
          </button>
          <button

            onClick={() => {
              setStatusFilter("pending");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-lg px-4 py-2.5 shadow-sm transition-all hover:shadow-md flex items-center gap-2 ${
              statusFilter === "pending" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Pending: {notifications.filter(n => n.status === 'pending').length}</span>
          </button>
          <button

            onClick={() => {
              setStatusFilter("approved");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-lg px-4 py-2.5 shadow-sm transition-all hover:shadow-md flex items-center gap-2 ${
              statusFilter === "approved" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">Approved: {notifications.filter(n => n.status === 'approved').length}</span>
          </button>
          <button

            onClick={() => {
              setStatusFilter("rejected");
              setCurrentPage(1);
            }}
            className={`bg-white rounded-lg px-4 py-2.5 shadow-sm transition-all hover:shadow-md flex items-center gap-2 ${
              statusFilter === "rejected" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium">Rejected: {notifications.filter(n => n.status === 'rejected').length}</span>
          </button>
        </div>
      </div>




















      {fetchLoading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row p-6 gap-6">
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setSelectedImage(notification.screenshot)}
                    className="block relative group cursor-zoom-in"
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <img 
                      src={notification.screenshot} 
                      alt="Payment Screenshot"
                      className="w-40 h-40 object-cover rounded-lg shadow-sm"
                    />
                  </button>
                </div>









                <div className="flex-grow space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">


                        <BookOpen className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{notification.course.title}</h3>
                      </div>



                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{notification.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{notification.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">₹{notification.amount.toLocaleString()}</span>
                        </div>
                      </div>




                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                      ${notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      notification.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                      {notification.status === 'pending' && <Clock className="w-4 h-4" />}
                      {notification.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {notification.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </span>
                  </div>










                  {notification.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={() => handleApprove(notification.id)}
                        disabled={actionLoading === notification.id}
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === notification.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(notification.id)}
                        disabled={actionLoading === notification.id}
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === notification.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  )}
                </div>





















              </div>
            </div>










          ))}
          
          {notifications.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No notifications found</p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-5xl w-full bg-white rounded-xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Payment Screenshot"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
