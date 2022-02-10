const config = {
    screens: {
        Notification:'Notification',
        Orders:'Orders',
        IncomingOrders:'IncomingOrders',
        MainTopTab:{
            screens:{
                RequestScreen:"RequestScreen",
                Chat:"Chat"
            }
        },
        MainDrawer:{
            screens:{
                MainBottomTab:{
                    screens:{
                        Enquiry:'Enquiry',
                        Learnings:'Learnings',
                        Home:{
                            screens:{
                                Homescreen:'Homescreen',
                                TeacherProfile:'TeacherProfile'
                            }
                        }
                    }
                }
            }
        }
    },
};

const linking = {
    prefixes: ["demo://app"],
    config,
};

export default linking;
