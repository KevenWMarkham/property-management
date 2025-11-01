'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

interface CommandItem {
  id: string;
  label: string;
  action: () => void;
  group: 'Navigation' | 'Actions';
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const commands: CommandItem[] = [
    // Navigation commands
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      action: () => navigate('/'),
      group: 'Navigation',
      keywords: ['home', 'dashboard', 'overview'],
    },
    {
      id: 'nav-properties',
      label: 'Go to Properties',
      action: () => navigate('/properties'),
      group: 'Navigation',
      keywords: ['properties', 'list', 'view', 'browse'],
    },
    {
      id: 'nav-tenants',
      label: 'Go to Tenants',
      action: () => navigate('/tenants'),
      group: 'Navigation',
      keywords: ['tenants', 'list', 'view', 'lessees'],
    },
    {
      id: 'nav-bookings',
      label: 'Go to Bookings',
      action: () => navigate('/bookings'),
      group: 'Navigation',
      keywords: ['bookings', 'reservations', 'list', 'calendar'],
    },

    // Action commands
    {
      id: 'action-add-property',
      label: 'Add Property',
      action: () => navigate('/properties/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'property', 'plus'],
    },
    {
      id: 'action-add-tenant',
      label: 'Add Tenant',
      action: () => navigate('/tenants/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'tenant', 'lessee', 'plus'],
    },
    {
      id: 'action-create-booking',
      label: 'Create Booking',
      action: () => navigate('/bookings/new'),
      group: 'Actions',
      keywords: ['add', 'create', 'new', 'booking', 'reservation', 'plus'],
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
        <Command>
          <Command.Input
            placeholder="Type a command or search..."
            className="w-full border-b border-gray-200 px-4 py-3 text-base outline-none placeholder:text-gray-400"
          />

          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-8 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            {['Navigation', 'Actions'].map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group-heading]]:uppercase"
              >
                {commands
                  .filter((cmd) => cmd.group === group)
                  .map((cmd) => (
                    <Command.Item
                      key={cmd.id}
                      onSelect={() => cmd.action()}
                      keywords={cmd.keywords}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-blue-50 aria-selected:text-blue-900 hover:bg-gray-50"
                    >
                      <span className="flex-1">{cmd.label}</span>
                      <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        ↵
                      </kbd>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
