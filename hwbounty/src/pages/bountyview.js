// React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import AppIcon from "../images/favicon.ico";

//MUI Stuff
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import LikeButton from "../components/bounty/LikeButton";
import BountyReward from "../components/bounty/BountyReward";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

// Requests
import axios from "axios";

// Expanding labels
import expandLabel, { compactLabel } from "../util/expandLabel";

import BountyNotFound from "../components/bounty/BountyNotFound";

const styles = (theme) => ({
  ...theme.spreadIt,
  root: {
    width: "50%",
    textAlign: "left",
  },
});

export class bountyview extends Component {
  constructor() {
    super();
    this.state = {
      bounty: 0,
      claimed: true,
      id: 0,
      posterIcon: "",
      posterName: "",
      labels: [],
      title: "",
      text: "​",
      comments: [],
      valid: true,
    };
  }

  componentDidMount = () => {
    axios
      .get(
        "/bounty/" +
          this.props.location.pathname.substring(
            this.props.location.pathname.lastIndexOf("/") + 1
          )
      )
      .then((res_obj) => {
        res_obj.data
          ? this.setState({
              id: res_obj.data.bountyID,
              title: res_obj.data.title,
              text: res_obj.data.description,
              posterName: res_obj.data.author.publicID,
              posterIcon: res_obj.data.author.pfp,
              comments: [],
              bounty: res_obj.data.points,
              claimed: false,
              labels: res_obj.data.tags.split(",").map((l, e) => {
                return expandLabel(l);
              }),
            })
          : this.setState({ valid: false });
        this.setState({
          errors: {
            handle: res_obj.data.data
              ? "The handle is either taken or too short"
              : null,
          },
        });
      });
  };

  render() {
    const classes = this.props;
    const { valid } = this.state;

    return (
      <div>
        {valid ? (
          <Card className={classes.root}>
            <CardHeader
              avatar={
                <Avatar
                  aria-label={this.state.posterName}
                  src={this.state.posterIcon}
                />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={this.state.title}
              subheader={"Posted by: " + this.state.posterName}
            />
            <CardContent>
              {this.state.labels.length > 0 ? (
                <span>
                  <span>Topics:</span> <br />
                  {this.state.labels.map((l, i) => {
                    return (
                      <Chip
                        label={l[0]}
                        style={l[1]}
                        component="a"
                        href={"/?t=" + compactLabel(l[0])}
                        clickable
                      />
                    );
                  })}{" "}
                  <br /> <br />
                </span>
              ) : null}

              <Typography variant="body2" color="textSecondary" component="p">
                {this.state.text.split("\n").map((l, i) => {
                  return (
                    <span id={i}>
                      {l}
                      <br />
                    </span>
                  );
                })}
              </Typography>
              <BountyReward
                pointReward={this.state.bounty}
                claimed={this.state.claimed}
              />
            </CardContent>
            <CardActions disableSpacing>
              <LikeButton bountyId={this.state.id} />

              <IconButton>
                <CommentIcon />
              </IconButton>
            </CardActions>
          </Card>
        ) : (
          <BountyNotFound />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(bountyview);