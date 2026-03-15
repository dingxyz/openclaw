import { html } from "lit";
import { icons } from "../icons.ts";
import { pathForTab } from "../navigation.ts";
import type { GatewaySessionRow } from "../types.ts";

export type SidebarSessionsProps = {
  sessions: GatewaySessionRow[] | null;
  basePath: string;
  loading?: boolean;
  editingKey: string | null;
  onStartEdit: (key: string) => void;
  onPatchLabel: (key: string, label: string | null) => void;
};

function sessionDisplayLabel(row: GatewaySessionRow): string {
  const label = typeof row.label === "string" ? row.label.trim() : "";
  return label || row.key;
}

function saveAndEnd(
  row: GatewaySessionRow,
  input: HTMLInputElement,
  onPatchLabel: SidebarSessionsProps["onPatchLabel"],
) {
  const value = input.value.trim();
  onPatchLabel(row.key, value || null);
}

export function renderSidebarSessions(props: SidebarSessionsProps) {
  const rows = props.sessions ?? [];
  if (props.loading && rows.length === 0) {
    return html`<span class="nav-item__text muted">Loading…</span>`;
  }
  if (rows.length === 0) {
    return html`<span class="nav-item__text muted">暂无会话</span>`;
  }
  return rows.map((row) => {
    const canLink = row.kind !== "global";
    const chatUrl = canLink
      ? `${pathForTab("chat", props.basePath)}?session=${encodeURIComponent(row.key)}`
      : null;
    const text = sessionDisplayLabel(row);
    const isEditing = props.editingKey === row.key;

    if (canLink && chatUrl) {
      if (isEditing) {
        return html`
          <span class="nav-item" title=${row.key}>
            <span class="nav-item__label-wrap">
              <input
                class="nav-item__input"
                .value=${row.label ?? ""}
                placeholder="请输入"
                aria-label="Edit label"
                @keydown=${(e: KeyboardEvent) => {
                  if (e.key === "Enter") {
                    saveAndEnd(row, e.target as HTMLInputElement, props.onPatchLabel);
                  }
                }}
                @blur=${(e: Event) => {
                  saveAndEnd(row, e.target as HTMLInputElement, props.onPatchLabel);
                }}
              />
            </span>
          </span>
        `;
      }
      return html`
        <a href=${chatUrl} class="nav-item history-item" title=${row.key}>
          <span class="nav-item__label-wrap flex-1 flex items-center justify-between">
            <span class="nav-item__text">${text}</span>
            <button
              type="button"
              class="nav-item__edit hidden"
              aria-label="Edit label"
              @click=${(e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                props.onStartEdit(row.key);
              }}
            >
              <span class="nav-item__icon" aria-hidden="true">${icons.edit}</span>
            </button>
          </span>
        </a>
      `;
    }
    return html`
      <span class="nav-item" title=${row.key}>
        <span class="nav-item__text">${text}</span>
      </span>
    `;
  });
}
