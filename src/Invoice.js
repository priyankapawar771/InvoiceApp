import React, { Component } from 'react'
import styles from './Invoice.module.scss'
import { Grid, Image, Input, Icon, TextArea, Form, GridColumn } from 'semantic-ui-react';
import LineItems from './LineItems'
import moment from 'moment';
import Logo from './logo.png';
import {v4} from 'uuid'
import Header from './Header'

class Invoice extends Component {

  locale = 'en-US'
  currency = 'USD'

  state = {
    taxRate: 0.00,
    lineItems: [
      {
        id: 'initial',      // react-beautiful-dnd unique key
        name: '',
        description: '',
        quantity: 0,
        price: 0.00,
      },
    ],
    date: moment(),
    to: '',
    currency: 'INR',
    number: '',
  }

  handleInvoiceChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleLineItemChange = (elementIndex) => (event) => {
    let lineItems = this.state.lineItems.map((item, i) => {
      if (elementIndex !== i) return item
      return {...item, [event.target.name]: event.target.value}
    })
    this.setState({lineItems})
  }

  handleAddLineItem = (event) => {
    this.setState({
      // use optimistic uuid for drag drop; in a production app this could be a database id
      lineItems: this.state.lineItems.concat(
        [{ id: v4(), name: '', description: '', quantity: 0, price: 0.00 }]
      )
    })
  }

  handleDateChange = date => {
    this.setState((prevState, props) => {
      return {
        date: moment(date)
      };
    });
  };

  handleRemoveLineItem = (elementIndex) => (event) => {
    this.setState({
      lineItems: this.state.lineItems.filter((item, i) => {
        return elementIndex !== i
      })
    })
  }

  handleReorderLineItems = (newLineItems) => {
    this.setState({
      lineItems: newLineItems,
    })
  }

  handleFocusSelect = (event) => {
    event.target.select()
  }

  handlePayButtonClick = () => {
    alert('The invoice is for demo purpose.')
  }

  formatCurrency = (amount) => {
    return (new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount))
  }

  calcTaxAmount = (c) => {
    return c * (this.state.taxRate / 100)
  }

  calcLineItemsTotal = () => {
    return this.state.lineItems.reduce((prev, cur) => (prev + (cur.quantity * cur.price)), 0)
  }

  calcTaxTotal = () => {
    return this.calcLineItemsTotal() * (this.state.taxRate / 100)
  }

  calcGrandTotal = () => {
    return this.calcLineItemsTotal() + this.calcTaxTotal()
  }

  BillToChange = data => {
    this.setState((prevState, props) => {
      return {
        to: data
      };
    });
  };


  onTaxChange = data => {
    this.setState((prevState, props) => {
      return {
        number: data
      };
    });
  };


  render = () => {
    return (

      <div className={styles.invoice}>
        <div className={styles.brand}>
          <img src="https://dl.hiapphere.com/data/thumb/202007/com.invoice.maker.generator_HiAppHere_com_icon.png" alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.addresses}>

          <div className={styles.from}>
          <Grid columns="equal" container>
    <Grid.Column>
      {/* <Image src={Logo} size="small" wrapped style={{width:"100px",height:"20px"}}/> */}
      <p style={{ marginTop: '2px' }}>Bill To</p>
      <Form>
        <TextArea
          value={this.address}
          onChange={evt => this.onBillToChange(evt.target.value)}
          placeholder="Who is this invoice to? (*required)Write Address,Name"
          required
        />
        <p>Email :</p>
        <input type='email' required value={this.email} placeholder='Enter Email' />

      </Form>
    </Grid.Column>
    <Grid.Column width={6} />
    <Grid.Column>
     Invoice Number:
      <Input
        onChange={evt => this.onTaxChange(evt.target.value)}
        style={{ marginBottom: '2px' }}
        iconPosition="left"
        placeholder="Invoice Number"
        required
      >
        <Icon name="hashtag" />
        <input value={this.invoiceNumber} />
      </Input>
      {/* <DatePicker dateValue={this.dateValue} onDateChange={this.onDateChange} /> */}
    </Grid.Column>
  </Grid>
          </div>
          <div>
            <div className={`${styles.valueTable} ${styles.to}`}>
              <div className={styles.row}>
                <div className={styles.label}><Grid.Column>
                     Costumer Id
                </Grid.Column></div>
                <div className={styles.value}><Grid.Column>
                    <input type='text' />
                </Grid.Column></div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}><Grid.Column>
                    Invoice Date:
                </Grid.Column></div>
                <div className={styles.value}><Grid.Column>
                    <input type="date" />
                </Grid.Column></div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}><Grid.Column>
                    Due Date:
                </Grid.Column></div>
                <div className={`${styles.value} ${styles.date}`}><Grid.Column>
                    <input type='date'/>
                </Grid.Column></div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}><Grid.Column>
                    Status
                </Grid.Column></div>
                <div className={`${styles.value} ${styles.date}`}><Grid.Column>
                    <select>
                        <option>Late</option>
                        <option>Outstanding</option>
                        <option>Paid</option>
                    </select>
                </Grid.Column></div>
              </div>
            </div>
          </div>
        </div>
        <h2>Invoice</h2>

          <LineItems
            items={this.state.lineItems}
            currencyFormatter={this.formatCurrency}
            addHandler={this.handleAddLineItem}
            changeHandler={this.handleLineItemChange}
            focusHandler={this.handleFocusSelect}
            deleteHandler={this.handleRemoveLineItem}
            reorderHandler={this.handleReorderLineItems}
          />

        <div className={styles.totalContainer}>
          <form>
            <div className={styles.valueTable}>
              <div className={styles.row}>
                <div className={styles.label}>Tax Rate (%)</div>
                <div className={styles.value}><input name="taxRate" type="number" step="0.01" value={this.state.taxRate} onChange={this.handleInvoiceChange} onFocus={this.handleFocusSelect} /></div>
              </div>
            </div>
          </form>
          <form>
            <div className={styles.valueTable}>
              <div className={styles.row}>
                <div className={styles.label}>Subtotal</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcLineItemsTotal())}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>Tax ({this.state.taxRate}%)</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcTaxTotal())}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>Total Due</div>
                <div className={`${styles.value} ${styles.currency}`}>{this.formatCurrency(this.calcGrandTotal())}</div>
              </div>
            </div>
           
          </form>
        </div>

        <div className={styles.pay}>
           <button className={styles.payNow} onClick={this.handlePayButtonClick} type='submit'>Pay Now</button>
        </div>

        <div className={styles.footer}>
          <div className={styles.comments}>
            <h4>Notes</h4>
            <p>You can Pay through cash in Bank <a href="https://bankofmaharashtra.in/">Bank Address</a>.</p>
            <p>Use Online Payment Option: Bank Details <a href="https://bankofmaharashtra.in/">Bank Details</a> and <a href="https://pay.google.com/intl/en_in/about/">Google Pay</a> </p>
            <p>Using Credit Card <a href="https://www.sbicard.com/en/personal/credit-cards.page" target='_blank'>Sbi card </a>.</p>
            <p>Send Cheques <a href="https://www.sbicard.com/">Sbi card </a>.</p>
          </div>
          <div className={styles.closing}>
            <div>Thank-you for your business</div>
          </div>
        </div>

      </div>

    )
  }

}

export default Invoice