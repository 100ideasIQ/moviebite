
import axios from 'axios';

const ANILIST_API = 'https://graphql.anilist.co';

export interface Anime {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  description: string;
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage: string;
  episodes: number;
  genres: string[];
  averageScore: number;
  seasonYear: number;
  format: string;
  status: string;
}

const anilistQuery = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media(search: $search, type: ANIME, sort: $sort) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
        }
        bannerImage
        episodes
        genres
        averageScore
        seasonYear
        format
        status
      }
    }
  }
`;

const animeDetailsQuery = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        large
        medium
      }
      bannerImage
      episodes
      genres
      averageScore
      seasonYear
      format
      status
      studios {
        nodes {
          name
        }
      }
      characters(perPage: 10) {
        nodes {
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
  }
`;

export const anilistService = {
  getPopularAnime: async (page: number = 1) => {
    const response = await axios.post(ANILIST_API, {
      query: anilistQuery,
      variables: {
        page,
        perPage: 20,
        sort: ['POPULARITY_DESC']
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data.data.Page;
  },

  getTrendingAnime: async (page: number = 1) => {
    const response = await axios.post(ANILIST_API, {
      query: anilistQuery,
      variables: {
        page,
        perPage: 20,
        sort: ['TRENDING_DESC']
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data.data.Page;
  },

  getTopRatedAnime: async (page: number = 1) => {
    const response = await axios.post(ANILIST_API, {
      query: anilistQuery,
      variables: {
        page,
        perPage: 20,
        sort: ['SCORE_DESC']
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data.data.Page;
  },

  searchAnime: async (query: string, page: number = 1) => {
    const response = await axios.post(ANILIST_API, {
      query: anilistQuery,
      variables: {
        page,
        perPage: 20,
        search: query,
        sort: ['POPULARITY_DESC']
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data.data.Page;
  },

  getAnimeDetails: async (id: number) => {
    const response = await axios.post(ANILIST_API, {
      query: animeDetailsQuery,
      variables: { id }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    return response.data.data.Media;
  },
};
