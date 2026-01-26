export declare const searchForAlbum: {
    albums: {
        href: string;
        limit: number;
        next: string;
        offset: number;
        previous: null;
        total: number;
        items: {
            album_type: string;
            total_tracks: number;
            available_markets: string[];
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            images: {
                height: number;
                url: string;
                width: number;
            }[];
            name: string;
            release_date: string;
            release_date_precision: string;
            type: string;
            uri: string;
            artists: {
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
            }[];
        }[];
    };
};
export declare const getNewReleases: {
    albums: {
        href: string;
        items: {
            album_type: string;
            artists: {
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
            }[];
            available_markets: string[];
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            images: {
                height: number;
                url: string;
                width: number;
            }[];
            name: string;
            release_date: string;
            release_date_precision: string;
            total_tracks: number;
            type: string;
            uri: string;
        }[];
        limit: number;
        next: string;
        offset: number;
        previous: null;
        total: number;
    };
};
export declare const getAlbumTracks: {
    href: string;
    items: {
        artists: {
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
        }[];
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        preview_url: null;
        track_number: number;
        type: string;
        uri: string;
        is_local: boolean;
    }[];
    limit: number;
    next: null;
    offset: number;
    previous: null;
    total: number;
};
export declare const getArtist: {
    external_urls: {
        spotify: string;
    };
    followers: {
        href: null;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
};
export declare const getAlbum: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
    artists: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }[];
    tracks: {
        href: string;
        limit: number;
        next: null;
        offset: number;
        previous: null;
        total: number;
        items: {
            artists: {
                external_urls: {
                    spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
            }[];
            available_markets: string[];
            disc_number: number;
            duration_ms: number;
            explicit: boolean;
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            name: string;
            preview_url: null;
            track_number: number;
            type: string;
            uri: string;
            is_local: boolean;
        }[];
    };
    copyrights: {
        text: string;
        type: string;
    }[];
    external_ids: {
        upc: string;
    };
    genres: never[];
    label: string;
    popularity: number;
};
//# sourceMappingURL=apiResponses.d.ts.map