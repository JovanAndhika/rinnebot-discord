// commands/askbrahma.js
import { SlashCommandBuilder } from 'discord.js';
import { generateAnswer } from '../services/gemini.js';

export default {
    data: new SlashCommandBuilder()
        .setName('askbrahma')
        .setDescription('Ask Brahma a question')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question you want to ask')
                .setRequired(true)
        ),

    // Fixed: interaction is now the first parameter
    async execute(interaction) {
        // 1. Defer reply immediately so the interaction doesn't time out while Gemini generates
        await interaction.deferReply();

        const question = interaction.options.getString('question');
        const username = interaction.member?.displayName || interaction.user.displayName || interaction.user.username;

        try {
            let answer = await generateAnswer(username, question);

            if (!answer || !answer.trim()) {
                answer = '*Brahma tilts her head with a smile.* "I\'m not quite sure how to answer that right now."';
            }

            // Ensure response does not exceed Discord\'s 1,300 character limit
            if (answer.length > 1300) {
                answer = answer.slice(0, 1297) + '...';
            }

            await interaction.editReply({
                content: answer,
            });
        } catch (error) {
            console.error('Error answering question:', error);

            await interaction.editReply({
                content: "Brahma looks thoughtful, but couldn't find the answer right now...",
            }).catch(console.error);
        }
    },
};