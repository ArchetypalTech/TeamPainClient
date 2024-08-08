import { graphql } from "$houdini";

export const updates = graphql(`
  subscription Event {
    eventEmitted {
      id
      keys
    }
  }
`);

export const katana = graphql(`
  subscription EntityModel($id: ID!) {
    entityUpdated(id: $id) {
      keys
      models {
        __typename,
        ... on Output {
          text
        }
      }
    }
  }
`);
