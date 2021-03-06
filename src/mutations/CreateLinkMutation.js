// 1
import { commitMutation } from "react-relay";
import environment from "../Environment";
import graphql from "babel-plugin-relay/macro";

// 2
const mutation = graphql`
  mutation CreateLinkMutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
      }
    }
  }
`;

// 3
export default (postedById, description, url, callback) => {
  // 4
  const variables = {
    input: {
      postedById,

      description,
      url,
      clientMutationId: ""
    }
  };

  // 5
  commitMutation(environment, {
    mutation,
    variables,
    // 6
    onCompleted: () => {
      callback();
    },
    onError: err => console.error(err)
  });
};
