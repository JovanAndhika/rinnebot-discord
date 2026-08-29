// commands/hugtsukuyomi.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { generateHugResponse } from '../services/gemini.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hugtsukuyomi')
        .setDescription('Hug Tsukuyomi and embrace her.'),

    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        // 1. Defer reply immediately so the interaction doesn't time out during AI generation
        await interaction.deferReply();

        const username = interaction.member?.displayName || interaction.user.displayName || interaction.user.username;

        try {
            let descriptionText = await generateHugResponse(username);

            if (!descriptionText || !descriptionText.trim()) {
                descriptionText = `Tsukuyomi softly wraps her arms around ${interaction.user}, resting her head against your shoulder. *"I'm always here for you."*`;
            }

            // Ensure embed description does not exceed Discord's 1,300 character limit
            if (descriptionText.length > 1300) {
                descriptionText = descriptionText.slice(0, 1297) + '...';
            }

            const hugEmbed = new EmbedBuilder()
                .setColor('#FFB6C1')
                .setTitle(`🌸 Tsukuyomi's warm hug`)
                .setDescription(descriptionText)
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [hugEmbed]
            });
        } catch (error) {
            console.error("Error generating hug response:", error);

            // Fallback embed if AI generation fails
            const fallbackEmbed = new EmbedBuilder()
                .setColor('#FFB6C1')
                .setTitle(`🌸 Tsukuyomi's warm hug`)
                .setDescription(`Tsukuyomi smiles gently upon seeing ${interaction.user}, pulling you into a warm embrace. *"You've worked hard today. Rest here for a while."*`)
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [fallbackEmbed]
            });
        }
    }
};