import React from 'react';

import Link from 'gatsby-link';
import FontIcon from 'react-md/lib/FontIcons';
import Avatar from 'react-md/lib/Avatars';
import TwitterBoxIcon from 'mdi-react/TwitterBoxIcon';
import FacebookBoxIcon from 'mdi-react/FacebookBoxIcon';

import NavigationDrawer from 'react-md/lib/NavigationDrawers';

import module from './index.module.scss';

import 'react-md/src/scss/_react-md.scss'
import 'react-md/dist/react-md.blue-light_blue.min.css'
import 'react-md/src/scss/_typography.scss'

import {ChipLink, ChipA} from '../components/Chips';

class EmLink extends React.Component {
    render() {
        return <u><Link {...this.props}/></u>
    }
}

function getNavList(query) {
    const result = [
        {
            primaryText: "Home",
            leftIcon: <FontIcon>home</FontIcon>,
            component: Link,
            to: "/"
        },
    ];

    for (let node of query.allMarkdownRemark.edges) {
        node = node.node;
        if (!node.frontmatter.index) {
            continue;
        }
        let pageDetails = {
            primaryText: node.frontmatter.label ? node.frontmatter.label : node.frontmatter.title,
            component: Link,
            to: node.fields.slug,
        };
        if (node.frontmatter.subheader) {
            result.push({divider: true});
            pageDetails.component = EmLink;
        }
        result.push(pageDetails);
    }

    return result;
}

export default ({children, data}) => {
    // const pageData = getPageData(data);
    return <div className={module.everything}>
        <NavigationDrawer
            toolbarTitle='Mannafields Christian School'
            contentClassName="main-content"
            navItems={getNavList(data)}
            defaultMedia='desktop'
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
            tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
            desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
        >
            <div className={module.wrapper}>
                {children()}
                <div className={module.main}>
                    <ChipLink to='/contact-us/'
                              avatar={<Avatar icon={<FontIcon>school</FontIcon>}/>}
                              label='Contact Us'/>
                    <ChipA to='tel:+441316595602' avatar={<Avatar icon={<FontIcon>phone</FontIcon>}/>}
                           label='(+44) 131 659 5602'/>
                    <ChipA to='mailto:info@mannafields.org'
                           avatar={<Avatar icon={<FontIcon>email</FontIcon>}/>}
                           label='info@mannafields.org'/>
                    <ChipA to='https://www.facebook.com/MannafieldsChristianSchool'
                           avatar={<Avatar icon={<FacebookBoxIcon className={module.icon}/>}/>}
                           label='Facebook'/>
                    <ChipA to='https://twitter.com/mannafields'
                           avatar={<Avatar icon={<TwitterBoxIcon className={module.icon}/>}/>}
                           label='@mannafields'/>
                </div>
                <div className={module.bottom}>
                    Copyright &copy; 2004-2017 Mannafields Christian Education Association. Scottish Charity No.
                    SC006202
                </div>
            </div>
        </NavigationDrawer>
    </div>
};

export const query = graphql`
    query LayoutQuery {
        file {
            relativePath
        }
        allMarkdownRemark(
            sort: { order: ASC, fields: [frontmatter___index] }
        ) {
            edges {
                node {
                    frontmatter {
                        title
                        subheader
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