import React, { Component } from 'react';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import SideBar from '../SideBar/SideBar';
import './Layout.css';
import ScrollArrow from '../UI/ScrollArrow/ScrollArrow';


class Layout extends Component {

    state = {
        showSideDrawer: false,
        navBarColor: true
    }

    typed = () => {
            //  typed
        // if ($('.typed').length) {
        //     var typed_strings = $(".typed").data('typed-items');
        //     typed_strings = typed_strings.split(',')
        //     new Typed('.typed', {
        //     strings: typed_strings,
        //     loop: true,
        //     typeSpeed: 100,
        //     backSpeed: 50,
        //     backDelay: 2000
        //     });
        // }
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render() {
        return(
            <>
                
                <Toolbar navBarColor={this.state.navBarColor} drawerToggleClicked={this.sideDrawerToggleHandler} />
                <div className="">
                    <div className="row">
                        <div className="col-md-3">
                            <SideBar />
                        </div>

                        <div className="col-md-9">
                        <SideDrawer
                            open={this.state.showSideDrawer}
                            closed={this.sideDrawerClosedHandler}      
                            drawerToggleClicked={this.sideDrawerClosedHandler}/>
                             <main className="Layout">
                                {this.props.children}
                            </main>
                        </div>

                    </div>

                </div>
                
               
                <ScrollArrow />
            </>                
        );
    }
}

export default Layout;