import { gql } from '@apollo/client';
import { resourcesFragment } from './fragments';

export const GET_FEATURED_RESOURCES = gql`
  query getFeaturedResources {
    resources(where: { featured: true }) {
      ...ResourcesFragment
    }
  }
  ${resourcesFragment}
`;

export const GET_RESOURCES = gql`
  query getResources {
    resources {
      ...ResourcesFragment
    }
  }
  ${resourcesFragment}
`;
