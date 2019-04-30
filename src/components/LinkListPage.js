import React, { Component } from "react";
import { QueryRenderer } from "react-relay";
import environment from "../Environment";
import LinkList from "./LinkList";
import graphql from "babel-plugin-relay/macro";
import { ITEMS_PER_PAGE } from "../constants";

const LinkListPageQuery = graphql`
  query LinkListPageQuery($count: Int!, $after: String) {
    viewer {
      ...LinkList_viewer
    }
  }
`;
class LinkListPage extends Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={LinkListPageQuery}
        variables={{
          count: ITEMS_PER_PAGE
        }}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            return <LinkList viewer={props.viewer} />;
          }
          return <div>Loading</div>;
        }}
      />
    );
  }
}

export default LinkListPage;
