import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import Img from 'gatsby-image';
import { Card, CardTitle, CardText } from 'react-md/lib/Cards';
import { Grid, Cell } from 'react-md/lib/Grids';
import { Media, MediaOverlay } from 'react-md/lib/Media';

function imageSizes(data, forPage) {
  for (const edge of data.allImageSharp.edges) {
    const node = edge.node;
    if (node.fields.matching_page === forPage) {
      return node.sizes;
    }
  }
  return null;
}

function mediaForPage(data, node) {
  const text = node.frontmatter.label ? node.frontmatter.label : node.frontmatter.title;
  const sizes = imageSizes(data, node.fields.slug);
  if (sizes) {
    return (
      <Media>
        <Img fluid={sizes} />
        <MediaOverlay>
          <CardTitle title={text} />
        </MediaOverlay>
      </Media>
    );
  } else {
    return (
      <Media>
        <MediaOverlay>
          <CardTitle title={text} />
        </MediaOverlay>
      </Media>
    );
  }
}

function cardForPage(data, node) {
  return (
    <Card className={Cell.getClassName({ side: 4 })} key={node.fields.slug}>
      <Link to={node.fields.slug}>{mediaForPage(data, node)}</Link>
    </Card>
  );
}

function cards(data) {
  return data.allMarkdownRemark.edges.map(({ node }) => cardForPage(data, node));
}

const openDay = () =>
  Date.now() < new Date('2022-11-05') ? (
    <>
      <CardTitle title={'Open Day: 5th November 2022'} />
      <CardText>
        <p>Come and visit the school on our next open day. Check back here for the date.</p>
      </CardText>
    </>
  ) : (
    []
  );

const Page = ({ data }) => (
  <div>
    <Helmet>
      <title>Mannafields Christian School</title>
    </Helmet>
    <Card>
      <CardText>
        <p>
          Located in central Edinburgh, Mannafields Christian School provides high quality primary and secondary
          education from a Christ-centred perspective.
        </p>
      </CardText>
      {openDay()}
    </Card>
    <Grid>{cards(data)}</Grid>
  </div>
);

Page.propTypes = {
  data: PropTypes.object,
};

export default Page;

export const query = graphql`
  query IndexImageSampleQuery {
    allImageSharp(filter: { fields: { level: { eq: 1 } } }) {
      edges {
        node {
          fields {
            matching_page
          }
          # Specify the image processing steps right in the query
          # Makes it trivial to update as your page's design changes.
          sizes(maxWidth: 960) {
            ...GatsbyImageSharpSizes
          }
        }
      }
    }
    allMarkdownRemark(filter: { fields: { level: { eq: 1 } } }, sort: { order: ASC, fields: [frontmatter___index] }) {
      edges {
        node {
          frontmatter {
            title
            index
            label
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
