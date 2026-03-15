import { html } from "lit";
import type { AgentsProps } from "./agents.ts";
import type { CronProps } from "./cron.ts";
import type { OverviewProps } from "./overview.ts";
import type { SkillsProps } from "./skills.ts";
import type { UsageProps } from "./usageTypes.ts";
import { renderAgents } from "./agents.ts";
import { renderCron } from "./cron.ts";
import { renderOverview } from "./overview.ts";
import { renderSkills } from "./skills.ts";
import { renderUsage } from "./usage.ts";

export type CustomProps = {
  overview: OverviewProps;
  agents: AgentsProps;
  skills: SkillsProps;
  usage: UsageProps;
  cron: CronProps;
};

export function renderCustom(props: CustomProps) {
  return html`
    <div class="setting-layout ">
      <div class="flex gap-6 mb-6">
        <div class="card flex-1">
          <div class="card-title mb-4">智能体状态</div>
          <div class="flex-1">${renderAgents(props.agents)}</div>
        </div>
        <!-- <div class="flex-1">${renderSkills(props.skills)}</div> -->
      </div>
      <div class="flex gap-6 mb-6 mt-6">
        <!-- <div class="card flex-1">${renderCron(props.cron)}</div> -->
        <div class="card flex-1">${renderUsage(props.usage)}</div>
      </div>

      <div class="card">
        <div class="card-title mb-4">系统信息与快照</div>
        ${renderOverview(props.overview)}
      </div>
      
    </div>
  `;
}
