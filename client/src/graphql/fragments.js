import { gql } from '@apollo/client';

export const resourcesFragment = gql`
  fragment ResourcesFragment on Resource {
    title
    description
    link
    tags {
      tag
    }
    shared_by {
      firstName
      lastName
      positions {
        title
        type
      }
      class {
        name
      }
      photo {
        url
      }
    }
  }
`;
