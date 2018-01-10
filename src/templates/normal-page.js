import React from "react";
import Helmet from 'react-helmet';

import {Card, CardText, CardTitle} from 'react-md/lib/Cards';
import {Grid, Cell} from 'react-md/lib/Grids';
import {FontIcon} from 'react-md/lib/FontIcons';
import {Avatar} from 'react-md/lib/Avatars';
import {ChipLink} from '../components/Chips';
import {Media, MediaOverlay} from 'react-md/lib/Media';
import Img from 'gatsby-image';

import module from './normalpage.module.css';
import Link from "gatsby-link";

function maybeLink(ref, direction, label) {
    if (ref) {
        return <ChipLink to={ref}
                         avatar={<Avatar icon={<FontIcon>arrow_{direction}</FontIcon>}/>}
                         label={label ? label : direction}/>;
    }
}

function navigation({up, prev, next}) {
    if (up || prev || next) {
        return <Grid>
            <Cell className={module.cell} size={4}>{maybeLink(prev, 'back', 'Previous')}</Cell>
            <Cell className={module.cell} size={4}>{maybeLink(up, 'upward', 'Contents')}</Cell>
            <Cell className={module.cell} size={4}>{maybeLink(next, 'forward', 'Next')}</Cell>
        </Grid>
    }
}

function header(data) {
    if (data.imageSharp) {
        return <Media>
            <Img sizes={data.imageSharp.sizes}/>
            <div className={module.breadcrumbs_block}>
                <Link to='/'>Home</Link>
                {
                    data.parents ? data.parents.edges.map(({node}) => (
                        <Link to={node.fields.slug}
                              key={node.fields.slug}>{node.frontmatter.label ? node.frontmatter.label : node.frontmatter.title}</Link>
                    )) : []
                }
            </div>
            <MediaOverlay>
                <CardTitle title={data.markdownRemark.frontmatter.title}/>
            </MediaOverlay>
        </Media>;
    } else {
        return [
            <div className={module.breadcrumbs_inline}>
                <Link to='/'>Home</Link>
                {
                    data.parents ? data.parents.edges.map(({node}) => ([
                        <span> > </span>,
                        <Link to={node.fields.slug}
                              key={node.fields.slug}>{node.frontmatter.label ? node.frontmatter.label : node.frontmatter.title}</Link>
                    ])) : []
                }
            </div>, <CardTitle title={data.markdownRemark.frontmatter.title}/>]
    }
}


function getNavList(query) {
    const edges = query.allMarkdownRemark ? query.allMarkdownRemark.edges : [];
    return edges.map(({node}) => (
        <Link to={node.fields.slug} className={Cell.getClassName({size: 4})} key={node.fields.slug}>
            <Card className={module.card_link}>
                <CardTitle title={node.frontmatter.label ? node.frontmatter.label : node.frontmatter.title}/>
            </Card>
        </Link>
    ));
}

export default ({data}) => {
    const post = data.markdownRemark;
    return (
        <div>
            <Card>
                <Helmet>
                    <title>{post.frontmatter.label ? post.frontmatter.label : post.frontmatter.title} | Mannafields
                        Christian School</title>
                </Helmet>
                {header(data)}
                <CardText>
                    <div dangerouslySetInnerHTML={{__html: post.html}}/>
                    {navigation(post.frontmatter)}
                </CardText>
            </Card>

            <Grid>
                {getNavList(data, post.fields.slug, post.fields.level)}
            </Grid>
        </div>
    );
};

export const query = graphql`
  query PageDataQuery($slug: String!, $resolved_slug: String!, $parent_regex: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        label
        up
        prev
        next
      }
      fields {
        slug
        level
      }
    }
      imageSharp(
        fields: { matching_page: { eq: $slug } }
      ){
          fields {
              matching_page
          }
          # Specify the image processing steps right in the query
          # Makes it trivial to update as your page's design changes.
          sizes(maxWidth: 960) {
              ...GatsbyImageSharpSizes
          }
      }
      allMarkdownRemark(
          filter: {fields: {parent: {eq: $resolved_slug}}}
          sort: { order: ASC, fields: [frontmatter___index] }
      ) {
          edges {
              node {
                  frontmatter {
                      title
                      index
                      label
                  }
                  fields {
                      slug
                      level
                      parent
                  }
              }
          }
      }
      parents: allMarkdownRemark (
      filter: {fields: {slug: {regex: $parent_regex }}}) {
	  edges {
	    node {
	      fields {
	        slug
	        level
	        parent
	        resolved_slug
          parent_regex
          }
          frontmatter {
              label
              title
	      }
	    }
	  }
	}
  }
`;

