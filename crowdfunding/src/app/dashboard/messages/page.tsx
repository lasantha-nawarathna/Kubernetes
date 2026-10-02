"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MoreVertical, Paperclip, Phone, Search, Send, Smile } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/ui/Avatar";
import data from "@/data/messages.json";
import { cn } from "@/lib/cn";

type Msg = { from: string; text: string; time: string; file?: string };

export default function MessagesPage() {
  const { toast } = useApp();
  const [convos, setConvos] = useState(data.map((c) => ({ ...c, messages: c.messages as Msg[] })));
  const [activeId, setActiveId] = useState(convos[0].id);
  const [mobileChat, setMobileChat] = useState(false);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const active = convos.find((c) => c.id === activeId)!;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active.messages.length, typing]);

  const append = (id: string, m: Msg) => setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, messages: [...c.messages, m] } : c)));
  const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const send = (msg: Msg) => {
    const id = activeId;
    append(id, msg);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      append(id, { from: "them", text: "Thanks for your message! We'll get back to you shortly. 🙌", time: now() });
    }, 1600);
  };

  const open = (id: string) => {
    setActiveId(id);
    setMobileChat(true);
    setConvos((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const filtered = convos.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.subtitle.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-[520px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
      {/* Conversation list */}
      <aside className={cn("w-full flex-col border-r border-slate-100 md:flex md:w-80 md:shrink-0", mobileChat ? "hidden" : "flex")}>
        <div className="border-b border-slate-100 p-4">
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
          <div className="relative mt-3">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations" className="h-10 w-full rounded-full bg-slate-100 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {filtered.map((c) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <li key={c.id}>
                <button onClick={() => open(c.id)} className={cn("flex w-full items-center gap-3 rounded-2xl p-3 text-left transition", c.id === activeId ? "bg-brand-50" : "hover:bg-slate-50")}>
                  <span className="relative">
                    <Avatar src={c.avatar} name={c.name} size={44} />
                    {c.online && <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{c.name}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{last.time}</span>
                    </span>
                    <span className="block truncate text-xs text-slate-500">{c.subtitle}</span>
                    <span className={cn("mt-0.5 block truncate text-sm", c.unread ? "font-semibold text-slate-800" : "text-slate-500")}>
                      {last.from === "me" && "You: "}
                      {last.text}
                    </span>
                  </span>
                  {c.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">{c.unread}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat */}
      <section className={cn("min-w-0 flex-1 flex-col md:flex", mobileChat ? "flex" : "hidden")}>
        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <button className="rounded-full p-1.5 hover:bg-slate-100 md:hidden" onClick={() => setMobileChat(false)} aria-label="Back to conversations">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar src={active.avatar} name={active.name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900">{active.name}</p>
            <p className="truncate text-xs text-slate-500">{active.online ? <span className="text-emerald-600">● Online</span> : "Last seen recently"} · {active.subtitle}</p>
          </div>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Call"><Phone className="h-5 w-5" /></button>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="More"><MoreVertical className="h-5 w-5" /></button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
          <p className="text-center text-xs font-medium text-slate-400">Conversation started via Fundora · messages are private</p>
          {active.messages.map((m, i) => (
            <div key={i} className={cn("flex items-end gap-2 animate-fade-up", m.from === "me" ? "justify-end" : "justify-start")}>
              {m.from !== "me" && <Avatar src={active.avatar} name={active.name} size={28} />}
              <div className={cn("max-w-[75%] rounded-3xl px-4 py-2.5 text-sm shadow-sm", m.from === "me" ? "rounded-br-lg bg-brand-600 text-white" : "rounded-bl-lg bg-white text-slate-800")}>
                {m.file ? (
                  <span className="flex items-center gap-2 font-medium"><Paperclip className="h-4 w-4" /> {m.file}</span>
                ) : (
                  m.text
                )}
                <p className={cn("mt-1 text-[10px]", m.from === "me" ? "text-white/70" : "text-slate-400")}>{m.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <Avatar src={active.avatar} name={active.name} size={28} />
              <div className="flex gap-1 rounded-3xl rounded-bl-lg bg-white px-4 py-3 shadow-sm">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) send({ from: "me", text: text.trim(), time: now() });
          }}
          className="flex items-center gap-2 border-t border-slate-100 p-3"
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                send({ from: "me", text: "", file: f.name, time: now() });
                toast({ title: "Attachment sent", description: f.name });
              }
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Attach file">
            <Paperclip className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 max-sm:hidden" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${active.name}…`} className="h-11 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/20" />
          <button disabled={!text.trim()} className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40" aria-label="Send">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </section>
    </div>
  );
}
