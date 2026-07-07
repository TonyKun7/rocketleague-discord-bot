import type CustomClient from "@/core/CustomClient.js"

import type { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder, StringSelectMenuInteraction } from "discord.js"

export enum InteractionType {
    Command = "command",
    Button = "button",
    SelectMenu = "selectMenu",
    Modal = "modal",
    Autocomplete = "autocomplete"
}

export type AnyInteraction = Command | Button | SelectMenu | Modal | Autocomplete;

export interface BaseInteraction {
    type: InteractionType;
}

export interface Command extends BaseInteraction {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    execute: (client: CustomClient, interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

export interface Button extends BaseInteraction {
    customId: string;
    execute: (client: CustomClient, interaction: ButtonInteraction) => Promise<void> | void;
}

export interface SelectMenu extends BaseInteraction {
    customId: string;
    execute: (client: CustomClient, interaction: StringSelectMenuInteraction) => Promise<void> | void;
}

export interface Modal extends BaseInteraction {
    customId: string;
    execute: (client: CustomClient, interaction: ModalSubmitInteraction) => Promise<void> | void;
}

export interface Autocomplete extends BaseInteraction {
    customId: string;
    execute: (client: CustomClient, interaction: AutocompleteInteraction) => Promise<void> | void;
}

export const createCommand = (command: Omit<Command, "type">) => ({ ...command, type: InteractionType.Command })
export const createButton = (button: Omit<Button, "type">) => ({ ...button, type: InteractionType.Button })
export const createSelectMenu = (selectMenu: Omit<SelectMenu, "type">) => ({ ...selectMenu, type: InteractionType.SelectMenu })
export const createModal = (modal: Omit<Modal, "type">) => ({ ...modal, type: InteractionType.Modal })
export const createAutocomplete = (autocomplete: Omit<Autocomplete, "type">) => ({ ...autocomplete, type: InteractionType.Autocomplete })