import { Plugin } from "obsidian";
import {
    LatestSettingsConfigVersion,
    SETTINGS_CONFIG_SCHEMA_MANAGER
} from "./schema/settings/settings_config.schema";
import { CreateLogger } from "./logging/logger";
import "disposablestack/auto";
import { Span } from "./logging/tracing/span.decorator";

const LOGGER = CreateLogger("main");

/** Plugin to add an image for user profiles. */
export default class DailyNotesPlugin extends Plugin {
    public settings: LatestSettingsConfigVersion;

    @Span()
    public override async onload(): Promise<void> {
        this.addRibbonIcon("cloud", "Go to Daily Notes", () => {
            LOGGER.debug("Ribbon icon clicked (not implemented).");
        });

        await this.loadSettings();

        // this.addSettingTab(new FirebaseSyncSettingTab(this.app, this));
    }

    @Span()
    public async saveSettings(): Promise<void> {
        LOGGER.debug("saving settings", { settings: this.settings });
        await this.saveData(this.settings);
    }

    @Span()
    public async loadSettings(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const dataFromObsidian = Object.assign({}, await this.loadData());
        const settingUpdated = SETTINGS_CONFIG_SCHEMA_MANAGER.updateSchema(dataFromObsidian);
        if (settingUpdated.err) {
            LOGGER.crit(`Setting loaded was invalid!`, {
                error: settingUpdated.val.toString(),
                original: JSON.stringify(dataFromObsidian)
            });
            this.settings = SETTINGS_CONFIG_SCHEMA_MANAGER.getDefault().unsafeUnwrap();
        } else {
            this.settings = settingUpdated.safeUnwrap();
        }
        LOGGER.debug("loaded settings", { dataFromObsidian, parsedSettings: this.settings });
    }
}
