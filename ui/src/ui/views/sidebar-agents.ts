import { html } from "lit";
import type { GatewayAgentRow } from "../types.ts";
import { agentBadgeText, normalizeAgentLabel } from "./agents-utils.ts";

export type SidebarAgentsProps = {
  agents: GatewayAgentRow[] | null;
  defaultId: string | null;
  selectedId: string | null;
  loading?: boolean;
  onSelect: (agentId: string) => void;
};

export function renderSidebarAgents(props: SidebarAgentsProps) {
  const agents = props.agents ?? [];
  if (props.loading && agents.length === 0) {
    return html`<span class="nav-item__text muted">Loading…</span>`;
  }
  if (agents.length === 0) {
    return html`<span class="nav-item__text muted">暂无 Agent</span>`;
  }
  return agents.map((agent) => {
    const label = normalizeAgentLabel(agent);
    const badge = agentBadgeText(agent.id, props.defaultId);
    const isActive = agent.id === props.selectedId;
    return html`
      <button
        type="button"
        class="agents-sidebar-item"
        title=${agent.id}
        @click=${() => props.onSelect(agent.id)}
      >
        <span class="nav-item__text">${label}${badge ? html` <span class="nav-item__badge">${badge}</span>` : null}</span>
      </button>
    `;
  });
}
