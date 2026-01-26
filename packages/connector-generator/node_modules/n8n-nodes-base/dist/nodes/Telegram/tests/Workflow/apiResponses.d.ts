export declare const getChatResponse: {
    ok: boolean;
    result: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        type: string;
        active_usernames: string[];
        bio: string;
        has_private_forwards: boolean;
        max_reaction_count: number;
        accent_color_id: number;
    };
};
export declare const sendMessageResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        text: string;
        entities: ({
            offset: number;
            length: number;
            type: string;
            url?: undefined;
        } | {
            offset: number;
            length: number;
            type: string;
            url: string;
        })[];
        link_preview_options: {
            is_disabled: boolean;
        };
    };
};
export declare const sendMediaGroupResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        photo: {
            file_id: string;
            file_unique_id: string;
            file_size: number;
            width: number;
            height: number;
        }[];
    }[];
};
export declare const sendLocationMessageResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        reply_to_message: {
            message_id: number;
            from: {
                id: number;
                is_bot: boolean;
                first_name: string;
                username: string;
            };
            chat: {
                id: number;
                first_name: string;
                last_name: string;
                username: string;
                type: string;
            };
            date: number;
            text: string;
            entities: ({
                offset: number;
                length: number;
                type: string;
                url?: undefined;
            } | {
                offset: number;
                length: number;
                type: string;
                url: string;
            })[];
            link_preview_options: {
                is_disabled: boolean;
            };
        };
        location: {
            latitude: number;
            longitude: number;
        };
    };
};
export declare const okTrueResponse: {
    ok: boolean;
    result: boolean;
};
export declare const sendStickerResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        document: {
            file_name: string;
            mime_type: string;
            thumbnail: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            thumb: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
    };
};
export declare const editMessageTextResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        edit_date: number;
        text: string;
        reply_markup: {
            inline_keyboard: ({
                text: string;
                callback_data: string;
                url?: undefined;
            } | {
                text: string;
                url: string;
                callback_data?: undefined;
            })[][];
        };
    };
};
export declare const chatAdministratorsResponse: {
    ok: boolean;
    result: ({
        user: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
            last_name?: undefined;
            language_code?: undefined;
        };
        status: string;
        can_be_edited: boolean;
        can_manage_chat: boolean;
        can_change_info: boolean;
        can_post_messages: boolean;
        can_edit_messages: boolean;
        can_delete_messages: boolean;
        can_invite_users: boolean;
        can_restrict_members: boolean;
        can_promote_members: boolean;
        can_manage_video_chats: boolean;
        can_post_stories: boolean;
        can_edit_stories: boolean;
        can_delete_stories: boolean;
        is_anonymous: boolean;
        can_manage_voice_chats: boolean;
    } | {
        user: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name: string;
            username: string;
            language_code: string;
        };
        status: string;
        is_anonymous: boolean;
        can_be_edited?: undefined;
        can_manage_chat?: undefined;
        can_change_info?: undefined;
        can_post_messages?: undefined;
        can_edit_messages?: undefined;
        can_delete_messages?: undefined;
        can_invite_users?: undefined;
        can_restrict_members?: undefined;
        can_promote_members?: undefined;
        can_manage_video_chats?: undefined;
        can_post_stories?: undefined;
        can_edit_stories?: undefined;
        can_delete_stories?: undefined;
        can_manage_voice_chats?: undefined;
    })[];
};
export declare const sendAnimationMessageResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        animation: {
            file_name: string;
            mime_type: string;
            duration: number;
            width: number;
            height: number;
            thumbnail: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            thumb: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
        document: {
            file_name: string;
            mime_type: string;
            thumbnail: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            thumb: {
                file_id: string;
                file_unique_id: string;
                file_size: number;
                width: number;
                height: number;
            };
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
        caption: string;
    };
};
export declare const sendAudioResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        audio: {
            duration: number;
            file_name: string;
            mime_type: string;
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
    };
};
export declare const getMemberResponse: {
    ok: boolean;
    result: {
        user: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name: string;
            username: string;
            language_code: string;
        };
        status: string;
        is_anonymous: boolean;
    };
};
export declare const sendMessageWithBinaryDataAndReplyMarkupResponse: {
    ok: boolean;
    result: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            username: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            username: string;
            type: string;
        };
        date: number;
        document: {
            file_name: string;
            mime_type: string;
            file_id: string;
            file_unique_id: string;
            file_size: number;
        };
        reply_markup: {
            inline_keyboard: {
                text: string;
                callback_data: string;
            }[][];
        };
    };
};
//# sourceMappingURL=apiResponses.d.ts.map