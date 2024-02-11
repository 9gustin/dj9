export type SpotifyPlayerState = {
  isPlaying: boolean;
  device: {
    id: string;
    isActive: boolean;
    name: string;
    type: "Computer" | "Smartphone" | "Speaker";
  };
  item: {
    id: string;
    name: string;
    cover: string;
  };
};

export type SpotifyPlayerStateResponse = {
  is_playing: boolean;
  device: {
    id: string;
    is_active: boolean;
    name: string;
    type: "Computer" | "Phone";
  };
  item: {
    id: string;
    name: string;
    album: {
      images: {
        url: string;
      }[];
    };
  };
};

export type SpotifySearchResponse = {
  artists: {
    items: {
      id: string;
      name: string;
      type: string;
      uri: string;
      images: {
        url: string;
      }[];
    }[];
  };
  tracks: {
    items: {
      id: string;
      name: string;
      type: string;
      uri: string;
      album: {
        images: {
          url: string;
        }[];
      };
      artists: {
        id: string;
        name: string;
      }[];
    }[];
  };
};

type BaseItem = {
  id: string;
  name: string;
  type: string;
  href?: string;
  uri?: string;
  image: string | undefined;
};

export type SpotifyTrack = BaseItem & {
  artists: {
    id: string;
    name: string;
  }[];
};

export type SpotifyArtist = BaseItem;

export type SearchItem = SpotifyArtist | SpotifyTrack;

export type SpotifySearchResult = {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
};

export type SpotifyRecommendationsResponse = {
  tracks: {
    id: string;
    name: string;
    type: string;
    uri: string;
    external_urls: {
      spotify: string;
    };
    album: {
      images: {
        url: string;
      }[];
    };
    artists: {
      id: string;
      name: string;
    }[];
  }[];
};
