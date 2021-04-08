const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    MEAL:   Symbol("meal"),
    PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sMeal = "";
        this.sItem = "popup meal";
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.MEAL;
                aReturn.push("Welcome to Popup Meals with Shaylan.");
                aReturn.push("Our upcoming meals include:");
                aReturn.push("Turkey Dinner on May 9, 2021");
                aReturn.push("Roast Beef Dinner on May 16, 2021");
                aReturn.push("Pulled Pork on a Bun on May 23, 2021");
                aReturn.push("What meal would you like to order?");
                break;
            case OrderState.MEAL:
                if(sInput.toLowerCase() == "turkey dinner" ||
                sInput.toLowerCase() == "roast beef dinner" ||
                sInput.toLowerCase() == "pulled pork on a bun"){
                this.stateCur = OrderState.PAYMENT
                this.sMeal = sInput;
                aReturn.push("Thank you for your order of the");
                aReturn.push(`${this.sMeal} ${this.sItem}`);
                }else{
                    aReturn.push("Please choose from the following meals, TURKEY DINNER, ROAST BEEF DINNER, or PULLED PORK ON A BUN.")
                }
                 //calculate $ for order
                 if(this.sMeal.toLowerCase().includes("turkey dinner")){
                  {
                      this.nOrder = 18;
                  }
                  }else if (this.sMeal.toLowerCase().includes("roast beef dinner")){
                  this.nOrder = 20;
                  }
                  if(this.sMeal.toLowerCase().includes("pulled pork on a bun")){
                          this.nOrder = 15;
                      }
               
                aReturn.push(`Please pay $${this.nOrder} for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);
                this.isDone(true);
                aReturn.push("Thank you for placing an order for Popup Meals with Shaylan. We'll contact you on the date of pick up.")
                break;
        }
        return aReturn;
    }
    renderForm(sTitle = "-1", sAmount = "-1"){
      // your client id should be kept private
      if(sTitle != "-1"){
        this.sItem = sTitle;
      }
      if(sAmount != "-1"){
        this.nOrder = sAmount;
      }
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}