import React, { Component } from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { GC_USER_ID } from "../constants";
import CreateVoteMutation from "../mutations/CreateVoteMutation";
import { fetchQuery } from "../Environment";
import { timeDifferenceForDate } from "../utils";

class Link extends Component {
  render() {
    const userId = localStorage.getItem(GC_USER_ID);
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {userId && (
            <div className="ml1 gray f11" onClick={() => this._voteForLink()}>
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.count} votes | by{" "}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : "Unknown"}{" "}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    );
  }
  _voteForLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID);
    if (!userId) {
      console.log(`Can't vote without user ID`);
      return;
    }

    const linkId = this.props.link.id;

    const canUserVoteOnLink = await this._userCanVoteOnLink(userId, linkId);
    if (canUserVoteOnLink) {
      CreateVoteMutation(userId, linkId);
    } else {
      console.log(`Current user already voted for that link`);
    }
  };

  _userCanVoteOnLink = async (userId, linkId) => {
    const checkVoteQueryText = `
      query CheckVoteQuery($userId: ID!, $linkId: ID!) {
        viewer {
          allVotes(filter: {
            user: { id: $userId },
            link: { id: $linkId }
          }) {
            edges {
              node {
                id
              }
            }
          }
        }
      }`;
    const checkVoteQuery = { text: checkVoteQueryText };

    const result = await fetchQuery(checkVoteQuery, { userId, linkId });
    return result.data.viewer.allVotes.edges.length === 0;
  };
}

export default createFragmentContainer(
  Link,
  graphql`
    fragment Link_link on Link {
      id
      description
      url
      createdAt
      postedBy {
        id
        name
      }
      votes {
        count
      }
    }
  `
);
