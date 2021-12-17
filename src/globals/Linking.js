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
                        Learnings:'Learnings'
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
