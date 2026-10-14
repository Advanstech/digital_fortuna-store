"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ShieldCheck, Handshake, Tag, CreditCard, Briefcase, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

import { authenticatedFetch, API_BASE, getValidAccessToken } from "@/lib/auth";

const TYPE_ICON: Record<string, typeof Bell> = {
  kyc: ShieldCheck,
  deal: Handshake,
  offer: Tag,
  payment: CreditCard,
  listing: Briefcase,
  system: Info,
};

const TYPE_COLOR: Record<string, string> = {
  kyc: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  deal: "text-[#0080FF] bg-[#0080FF]/10 border-[#0080FF]/20",
  offer: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  payment: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  listing: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  system: "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationBell() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    const token = await getValidAccessToken();
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
    try {
      const res = await authenticatedFetch(`${API_BASE}/notifications?limit=30`);
      if (!res.ok) return;
      const raw = await res.json();
      const data = raw.data || raw;
      setItems(Array.isArray(data.items) ? data.items : []);
      setUnread(typeof data.unread === "number" ? data.unread : 0);
    } catch {
      // silent — the bell just stays empty
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await getValidAccessToken();
      if (mounted) {
        setIsLoggedIn(!!token);
        if (token) {
          fetchNotifications();
        }
      }
    })();
    const interval = setInterval(fetchNotifications, 45000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const markRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
    try {
      await authenticatedFetch(`${API_BASE}/notifications/${id}/read`, {
        method: "PATCH",
      });
    } catch {}
  };

  const markAllRead = async () => {
    setLoading(true);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      await authenticatedFetch(`${API_BASE}/notifications/read-all`, {
        method: "PATCH",
      });
    } catch {} finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => {
          const opening = !isOpen;
          setIsOpen(opening);
          if (opening) fetchNotifications();
        }}
        aria-label="Notifications"
        className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0080FF] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0A0F1E]">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[min(92vw,380px)] bg-[#131A2E] border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[60]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={loading}
                  className="text-xs font-semibold text-[#0080FF] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No notifications yet.</p>
                  <p className="text-xs text-slate-600 mt-1">Offers, messages, KYC and payment updates will appear here.</p>
                </div>
              ) : (
                items.map((n) => {
                  const Icon = TYPE_ICON[n.type] || Info;
                  const color = TYPE_COLOR[n.type] || TYPE_COLOR.system;
                  const content = (
                    <div
                      className={`flex gap-3 px-4 py-3.5 border-b border-slate-800/50 transition-colors cursor-pointer ${
                        n.read ? "opacity-60 hover:bg-slate-800/20" : "bg-[#0080FF]/[0.04] hover:bg-[#0080FF]/10"
                      }`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-white leading-snug">{n.title}</p>
                          {!n.read && <span className="shrink-0 w-2 h-2 mt-1.5 rounded-full bg-[#0080FF]" />}
                        </div>
                        {n.body && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>}
                        <p className="text-[10px] text-slate-600 mt-1 font-mono uppercase tracking-wider">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  );
                  return (
                    <div key={n.id} onClick={() => !n.read && markRead(n.id)}>
                      {n.link ? (
                        <Link href={n.link} onClick={() => { if (!n.read) markRead(n.id); setIsOpen(false); }}>
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
