export const permission = (session,pathname) => {
    const sensitiveRoutes = ['/dashboard']
    let menuList = {
        "invoice" : "/invoice",
        "estimate" : "/estimate",
        "stock" : "/stock",
        "receipt" : "/receipt",
        "purchase_order" : "/po",
        "payment_voucher" : "/payment-vouchers",
        "tax" : "/tax",
        "customer" : "/customer",
        "supplier" : "/supplier",
        "product" : "/product",
        "service" : "/service",
        "debit_note" : "/debit_note",
        "credit_note" : "/credit_note",
        "sub_admin" : "/sub_admin",
    }
    let menuListKey = Object.keys(menuList)
    if(session && session.user ){
        if (session.user.role == "USER"){
            sensitiveRoutes.push("/user")
            sensitiveRoutes.push("/business")
            sensitiveRoutes.push("/item")
            sensitiveRoutes.push("/report")
            sensitiveRoutes.push("/settings")
            sensitiveRoutes.push("/faq")
            sensitiveRoutes.push("/support")
            sensitiveRoutes.push("/comma-format")
            sensitiveRoutes.push("/language")
            sensitiveRoutes.push("/redeem")
            sensitiveRoutes.push("/subscription")
            sensitiveRoutes.push("/payment")
            sensitiveRoutes.push("/about")
            sensitiveRoutes.push("/privacy")
            menuListKey.map((menuListKeyItem, menuListKeyKey) => {
                sensitiveRoutes.push(menuList[menuListKeyItem])
            })
        }else{
            if (session.user.permission['sub_admin'] == 1){
                menuListKey.map((menuListKeyItem, menuListKeyKey) => {
                    sensitiveRoutes.push(menuList[menuListKeyItem])
                })
            }else{
                menuListKey.map((menuListKeyItem, menuListKeyKey) => {
                    if (session.user.permission[menuListKeyItem] == 1){
                        sensitiveRoutes.push(menuList[menuListKeyItem])
                    }
                })
            }
        }
    }
    // console.log(sensitiveRoutes)
    // return (sensitiveRoutes);
    return sensitiveRoutes.some((route) =>
        pathname.startsWith(route)
    )

};