'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, Check, Users } from 'lucide-react';
import { TeamMember } from '@/types';
import { isMemberInAuthorString, toggleMemberInAuthorString } from '@/utils/authorParser';

interface MultiAuthorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  teamMembers: TeamMember[];
  roleValue?: string;
  onRoleChange?: (role: string) => void;
  placeholder?: string;
  helperText?: string;
}

export const MultiAuthorPicker: React.FC<MultiAuthorPickerProps> = ({
  label = 'نام نویسنده / صاحب اثر:',
  value,
  onChange,
  teamMembers,
  roleValue,
  onRoleChange,
  placeholder = 'مثلاً: @احمد، @رضا یا انتخاب از لیست زیر',
  helperText = 'امکان انتخاب و @ کردن چند نفر هم‌زمان بدون محدودیت'
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [dropdownOpen]);

  const handleToggleMember = (member: TeamMember) => {
    const isSelected = isMemberInAuthorString(value, member.name_fa);
    const nextValue = toggleMemberInAuthorString(value, member.name_fa);
    onChange(nextValue);

    // If role setter provided and adding member
    if (onRoleChange && !isSelected && member.role_fa) {
      if (!roleValue || !roleValue.trim()) {
        onRoleChange(member.role_fa);
      } else if (!roleValue.includes(member.role_fa)) {
        onRoleChange(`${roleValue} / ${member.role_fa}`);
      }
    }
  };

  const selectedCount = teamMembers.filter((m) => isMemberInAuthorString(value, m.name_fa)).length;

  return (
    <div className="relative space-y-2" ref={containerRef}>
      {/* Top Header Label & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block font-bold text-[var(--text-primary)] text-xs flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#1B889A]" />
          <span>{label}</span>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#1B889A] text-white text-[10px] font-extrabold">
              {selectedCount} نفر تگ شده
            </span>
          )}
        </label>

        <div className="flex items-center gap-2">
          {value.trim() && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[10px] text-[var(--text-secondary)] hover:text-red-500 transition-colors"
              title="پاک کردن همه نویسندگان"
            >
              پاک کردن
            </button>
          )}

          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-[10px] font-bold text-[#1B889A] hover:underline flex items-center gap-1 bg-[#1B889A]/10 px-2.5 py-1 rounded-lg border border-[#1B889A]/30 transition-all active:scale-95 shadow-xs"
          >
            <UserCheck className="w-3 h-3 text-[#1B889A]" />
            <span>@ لیست کامل تیم ({teamMembers.length} نفر)</span>
          </button>
        </div>
      </div>

      {/* Main Input for manual typing or display */}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value.endsWith('@')) {
            setDropdownOpen(true);
          }
        }}
        placeholder={placeholder}
        className="w-full p-2.5 bg-[var(--bg-color)] border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] font-serif-persian text-xs focus:outline-none focus:border-[#1B889A] transition-colors shadow-xs"
      />

      {/* Team Members Quick Selector Chips (Multi-Selectable) */}
      {teamMembers && teamMembers.length > 0 && (
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto p-0.5">
            {teamMembers.map((member) => {
              const selected = isMemberInAuthorString(value, member.name_fa);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleToggleMember(member)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border shadow-xs active:scale-95 ${
                    selected
                      ? 'bg-[#1B889A] text-white border-[#1B889A] ring-2 ring-[#1B889A]/30 font-extrabold'
                      : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[#1B889A] hover:text-[var(--text-primary)]'
                  }`}
                  title={selected ? `حذف ${member.name_fa}` : `اضافه کردن ${member.name_fa}`}
                >
                  {selected ? (
                    <Check className="w-3 h-3 text-white shrink-0" />
                  ) : member.avatar_url && !member.avatar_url.includes('unsplash.com') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.avatar_url} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1B889A]/20 text-[#1B889A] flex items-center justify-center text-[9px] font-bold shrink-0">
                      @
                    </span>
                  )}
                  <span>@{member.name_fa}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] font-serif-persian flex items-center gap-1">
            <span>💡</span>
            <span>{helperText}</span>
          </p>
        </div>
      )}

      {/* Dropdown Menu (Multi-Select Popover) */}
      {dropdownOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-[var(--card-bg)] border-2 border-[#1B889A] rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-xs font-bold text-[#1B889A] p-1.5 border-b border-[var(--card-border)] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              <span>انتخاب چند عضو هم‌زمان (تیک بزنید):</span>
            </div>
            <button
              type="button"
              onClick={() => setDropdownOpen(false)}
              className="px-2 py-0.5 rounded-lg bg-[#1B889A] text-white text-[10px] hover:bg-[#156d7b] transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>بستن / تأیید</span>
            </button>
          </div>

          <div className="space-y-1 pt-1">
            {teamMembers.map((member) => {
              const selected = isMemberInAuthorString(value, member.name_fa);
              return (
                <div
                  key={member.id}
                  onClick={() => handleToggleMember(member)}
                  className={`p-2 rounded-xl cursor-pointer flex items-center justify-between gap-2.5 transition-all text-xs ${
                    selected
                      ? 'bg-[#1B889A]/15 border border-[#1B889A]/40 text-[#1B889A]'
                      : 'hover:bg-[var(--bg-color)] border border-transparent text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {member.avatar_url && !member.avatar_url.includes('unsplash.com') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-[#1B889A] shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#1B889A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {member.name_fa.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold block truncate">@{member.name_fa}</span>
                      <span className="text-[10px] text-[var(--text-secondary)] block truncate">{member.role_fa}</span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-[#1B889A] border-[#1B889A] text-white' : 'border-[var(--card-border)] bg-[var(--bg-color)]'
                  }`}>
                    {selected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
