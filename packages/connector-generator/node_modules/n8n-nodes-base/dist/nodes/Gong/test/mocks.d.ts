export declare const gongApiResponse: {
    postCalls: {
        requestId: string;
        callId: string;
    };
    postCallsMedia: {
        requestId: string;
        callId: string;
        url: string;
    };
    postCallsExtensive: {
        requestId: string;
        records: {
            totalRecords: number;
            currentPageSize: number;
            currentPageNumber: number;
            cursor: string;
        };
        calls: {
            metaData: {
                id: string;
                url: string;
                title: string;
                scheduled: number;
                started: number;
                duration: number;
                primaryUserId: string;
                direction: string;
                system: string;
                scope: string;
                media: string;
                language: string;
                workspaceId: string;
                sdrDisposition: string;
                clientUniqueId: string;
                customData: string;
                purpose: string;
                meetingUrl: string;
                isPrivate: boolean;
                calendarEventId: string;
            };
            context: {
                system: string;
                objects: {
                    objectType: string;
                    objectId: string;
                    fields: {
                        name: string;
                        value: string;
                    }[];
                    timing: string;
                }[];
            }[];
            parties: {
                id: string;
                emailAddress: string;
                name: string;
                title: string;
                userId: string;
                speakerId: string;
                context: {
                    system: string;
                    objects: {
                        objectType: string;
                        objectId: string;
                        fields: {
                            name: string;
                            value: string;
                        }[];
                        timing: string;
                    }[];
                }[];
                affiliation: string;
                phoneNumber: string;
                methods: string[];
            }[];
            content: {
                structure: {
                    name: string;
                    duration: number;
                }[];
                trackers: {
                    id: string;
                    name: string;
                    count: number;
                    type: string;
                    occurrences: {
                        startTime: number;
                        speakerId: string;
                    }[];
                    phrases: {
                        count: number;
                        occurrences: {
                            startTime: number;
                            speakerId: string;
                        }[];
                        phrase: string;
                    }[];
                }[];
                topics: {
                    name: string;
                    duration: number;
                }[];
                pointsOfInterest: {
                    actionItems: {
                        snippetStartTime: number;
                        snippetEndTime: number;
                        speakerID: string;
                        snippet: string;
                    }[];
                };
                brief: string;
                outline: {
                    section: string;
                    startTime: number;
                    duration: number;
                    items: {
                        text: string;
                        startTime: number;
                    }[];
                }[];
                highlights: {
                    title: string;
                    items: {
                        text: string;
                        startTimes: number[];
                    }[];
                }[];
                callOutcome: {
                    id: string;
                    category: string;
                    name: string;
                };
                keyPoints: {
                    text: string;
                }[];
            };
            interaction: {
                speakers: {
                    id: string;
                    userId: string;
                    talkTime: number;
                }[];
                interactionStats: {
                    name: string;
                    value: number;
                }[];
                video: {
                    name: string;
                    duration: number;
                }[];
                questions: {
                    companyCount: number;
                    nonCompanyCount: number;
                };
            };
            collaboration: {
                publicComments: {
                    id: string;
                    audioStartTime: number;
                    audioEndTime: number;
                    commenterUserId: string;
                    comment: string;
                    posted: number;
                    inReplyTo: string;
                    duringCall: boolean;
                }[];
            };
            media: {
                audioUrl: string;
                videoUrl: string;
            };
        }[];
    };
    postCallsTranscript: {
        requestId: string;
        records: {
            totalRecords: number;
            currentPageSize: number;
            currentPageNumber: number;
        };
        callTranscripts: {
            callId: string;
            transcript: {
                speakerId: string;
                topic: string;
                sentences: {
                    start: number;
                    end: number;
                    text: string;
                }[];
            }[];
        }[];
    };
    postUsersExtensive: {
        requestId: string;
        records: {
            totalRecords: number;
            currentPageSize: number;
            currentPageNumber: number;
            cursor: string;
        };
        users: {
            id: string;
            emailAddress: string;
            created: string;
            active: boolean;
            emailAliases: string[];
            trustedEmailAddress: string;
            firstName: string;
            lastName: string;
            title: string;
            phoneNumber: string;
            extension: string;
            personalMeetingUrls: string[];
            settings: {
                webConferencesRecorded: boolean;
                preventWebConferenceRecording: boolean;
                telephonyCallsImported: boolean;
                emailsImported: boolean;
                preventEmailImport: boolean;
                nonRecordedMeetingsImported: boolean;
                gongConnectEnabled: boolean;
            };
            managerId: string;
            meetingConsentPageUrl: string;
            spokenLanguages: {
                language: string;
                primary: boolean;
            }[];
        }[];
    };
};
export declare const gongNodeResponse: {
    getCall: {
        json: {
            metaData: {
                id: string;
                url: string;
                title: string;
                scheduled: number;
                started: number;
                duration: number;
                primaryUserId: string;
                direction: string;
                system: string;
                scope: string;
                media: string;
                language: string;
                workspaceId: string;
                sdrDisposition: string;
                clientUniqueId: string;
                customData: string;
                purpose: string;
                meetingUrl: string;
                isPrivate: boolean;
                calendarEventId: string;
            };
            context: {
                system: string;
                objects: {
                    objectType: string;
                    objectId: string;
                    fields: {
                        name: string;
                        value: string;
                    }[];
                    timing: string;
                }[];
            }[];
            parties: {
                id: string;
                emailAddress: string;
                name: string;
                title: string;
                userId: string;
                speakerId: string;
                context: {
                    system: string;
                    objects: {
                        objectType: string;
                        objectId: string;
                        fields: {
                            name: string;
                            value: string;
                        }[];
                        timing: string;
                    }[];
                }[];
                affiliation: string;
                phoneNumber: string;
                methods: string[];
            }[];
            content: {
                structure: {
                    name: string;
                    duration: number;
                }[];
                trackers: {
                    id: string;
                    name: string;
                    count: number;
                    type: string;
                    occurrences: {
                        startTime: number;
                        speakerId: string;
                    }[];
                    phrases: {
                        count: number;
                        occurrences: {
                            startTime: number;
                            speakerId: string;
                        }[];
                        phrase: string;
                    }[];
                }[];
                topics: {
                    name: string;
                    duration: number;
                }[];
                pointsOfInterest: {
                    actionItems: {
                        snippetStartTime: number;
                        snippetEndTime: number;
                        speakerID: string;
                        snippet: string;
                    }[];
                };
                brief: string;
                outline: {
                    section: string;
                    startTime: number;
                    duration: number;
                    items: {
                        text: string;
                        startTime: number;
                    }[];
                }[];
                highlights: {
                    title: string;
                    items: {
                        text: string;
                        startTimes: number[];
                    }[];
                }[];
                callOutcome: {
                    id: string;
                    category: string;
                    name: string;
                };
                keyPoints: {
                    text: string;
                }[];
            };
            interaction: {
                speakers: {
                    id: string;
                    userId: string;
                    talkTime: number;
                }[];
                interactionStats: {
                    name: string;
                    value: number;
                }[];
                video: {
                    name: string;
                    duration: number;
                }[];
                questions: {
                    companyCount: number;
                    nonCompanyCount: number;
                };
            };
            collaboration: {
                publicComments: {
                    id: string;
                    audioStartTime: number;
                    audioEndTime: number;
                    commenterUserId: string;
                    comment: string;
                    posted: number;
                    inReplyTo: string;
                    duringCall: boolean;
                }[];
            };
            media: {
                audioUrl: string;
                videoUrl: string;
            };
            transcript: {
                speakerId: string;
                topic: string;
                sentences: {
                    start: number;
                    end: number;
                    text: string;
                }[];
            }[];
        };
    }[];
    getAllCall: {
        json: {
            id: string;
            url: string;
            title: string;
            scheduled: number;
            started: number;
            duration: number;
            primaryUserId: string;
            direction: string;
            system: string;
            scope: string;
            media: string;
            language: string;
            workspaceId: string;
            sdrDisposition: string;
            clientUniqueId: string;
            customData: string;
            purpose: string;
            meetingUrl: string;
            isPrivate: boolean;
            calendarEventId: string;
            content: {
                topics: {
                    name: string;
                    duration: number;
                }[];
            };
            parties: {
                id: string;
                emailAddress: string;
                name: string;
                title: string;
                userId: string;
                speakerId: string;
                context: {
                    system: string;
                    objects: {
                        objectType: string;
                        objectId: string;
                        fields: {
                            name: string;
                            value: string;
                        }[];
                        timing: string;
                    }[];
                }[];
                affiliation: string;
                phoneNumber: string;
                methods: string[];
            }[];
        };
    }[];
    getAllCallNoOptions: {
        json: {
            id: string;
            url: string;
            title: string;
            scheduled: number;
            started: number;
            duration: number;
            primaryUserId: string;
            direction: string;
            system: string;
            scope: string;
            media: string;
            language: string;
            workspaceId: string;
            sdrDisposition: string;
            clientUniqueId: string;
            customData: string;
            purpose: string;
            meetingUrl: string;
            isPrivate: boolean;
            calendarEventId: string;
        };
    }[];
    getUser: {
        json: {
            id: string;
            emailAddress: string;
            created: string;
            active: boolean;
            emailAliases: string[];
            trustedEmailAddress: string;
            firstName: string;
            lastName: string;
            title: string;
            phoneNumber: string;
            extension: string;
            personalMeetingUrls: string[];
            settings: {
                webConferencesRecorded: boolean;
                preventWebConferenceRecording: boolean;
                telephonyCallsImported: boolean;
                emailsImported: boolean;
                preventEmailImport: boolean;
                nonRecordedMeetingsImported: boolean;
                gongConnectEnabled: boolean;
            };
            managerId: string;
            meetingConsentPageUrl: string;
            spokenLanguages: {
                language: string;
                primary: boolean;
            }[];
        };
    }[];
    getAllUser: {
        json: {
            id: string;
            emailAddress: string;
            created: string;
            active: boolean;
            emailAliases: string[];
            trustedEmailAddress: string;
            firstName: string;
            lastName: string;
            title: string;
            phoneNumber: string;
            extension: string;
            personalMeetingUrls: string[];
            settings: {
                webConferencesRecorded: boolean;
                preventWebConferenceRecording: boolean;
                telephonyCallsImported: boolean;
                emailsImported: boolean;
                preventEmailImport: boolean;
                nonRecordedMeetingsImported: boolean;
                gongConnectEnabled: boolean;
            };
            managerId: string;
            meetingConsentPageUrl: string;
            spokenLanguages: {
                language: string;
                primary: boolean;
            }[];
        };
    }[];
};
//# sourceMappingURL=mocks.d.ts.map