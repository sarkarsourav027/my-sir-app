import React from 'react';
import logoIcon from "@/public/assets/img/logo.jpeg";
import Image from "next/image";

const PdfContent = () => {
    return (
        <div>
            <div className="invoice-box">
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                    <tr className="top temp_3">
                        <td colSpan="3">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <b>Company Name</b><br/>Address

                                    </td>
                                    <td>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td align="right">
                                                    <Image className="rounded-full mr-3"
                                                           src={logoIcon}
                                                           width={120}
                                                           height={120}
                                                           alt="Picture of the author"
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>

                    </tr>
                    <tr className="temp_4">
                        <td colSpan="4">
                            <table>
                                <tbody>
                                <tr>
                                    <td align="center">
                                        <b>Title_</b>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr className="temp_4">
                        <td className="color" style="width: 30%; text-align: center;">
                            <table>
                                <tbody>
                                <tr>
                                    <td style="width:60px">Bill To:</td>
                                    <td className="text-left">
                                        Client N
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <td className="color" style="width: 30%; text-align: center;">
                            <table>
                                <tr>
                                    <td style="width:75px">Ship To:</td>
                                    <td className="add">#Shipp</td>
                                </tr>
                            </table>
                        </td>
                        <td className="color" style="width: 30%; text-align: center;">
                            <table>
                                <tbody>
                                <tr>
                                    <td>

                                        Estimate No:<br /> Estimate Date:<br /> Reference No:<br />
                                    </td>
                                    <td style="text-align:right;">

                                        INV-564<br /> invD

                                        <br /> refNo
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <table>
                                <tbody>
                                <tr>
                                    <td align="left">
                                        <b>SUMMARY</b>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="3">
                            <table border="solid 1px #000" className="summary" style="padding: 15px;">
                                <thead style="background-color: #799f6e ;">
                                <tr>
                                    <th width="45%">Description</th>
                                    <th>Quantity</th>
                                    <th width="22%">Rate</th>
                                    <th width="20%" style="padding-right: 10px;text-align:right;padding-right:10px;">Amount_</th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                                <tfoot>
                                <tr>

                                    <td colSpan="2" className="no_border" style="padding-left: 10px;">
                                        <h4 style="margin-bottom:0px;margin-top:0px;"></h4>
                                        <p style="width:20%; display: inline-block; vertical-align: inherit;"></p>
                                        <span style="width:70%; display: inline-block;">
                                        <p width="50%"></p>
                                    </span>
                                        <p style="width:20%; display: inline-block; vertical-align: inherit;"></p>
                                        <span style="width:70%; display: inline-block;">
                                        <p width="50%"></p>
                                    </span>
                                        <p style="width:20%; display: inline-block; vertical-align: inherit;"></p>
                                        <span style="width:48%; display: inline-block;">
                                        <p width="50%"></p>
                                        <p width="50%"></p>
                                        <p width="50%"></p>
                                        <p width="50%"></p>
                                        </span>
                                    </td>

                                    <td className="text-left" style="padding-left: 10px;">
                                        <b>Gross Amount</b>
                                        <p> Discount </p>
                                        <b> SubTotal </b>
                                        <p> Tax </p>
                                        <p> Shipping </p>
                                    </td>
                                    <td  style="padding-right: 10px;text-align:right;padding-right:10px;">
                                        <b>GrossAm-</b>
                                        <p> Discount- </p>
                                        <b> SubTotal- </b>
                                        <p> Txses- </p>
                                        <p> Shipping- </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="no_border"></td>
                                </tr>
                                <tr>
                                <td className="text-left" style="padding-left: 10px; background-color: #799f6e;"><b>Net Amount</b></td>
                                </tr>
                                <tr>
                                <td className="" style="padding-right: 10px;text-align:right;padding-right:10px; background-color: #799f6e;"><b>Total Amount-</b></td>
                                </tr>

                    <tr className="hide"><td colSpan="2" className="no_border"></td><td style="padding-left: 10px;text-align:left;">Paid Amount</td><td style="padding-right: 10px;text-align:right;padding-right:10px;">PaidsAmount</td></tr>

                    </tfoot>
                </table>
            </td>
        </tr>
    <tr>
        <td>#SIGNATURES#</td>
    </tr>


    <tr>
        <td colSpan="5">
            <table>
                <tbody>
                <tr>
                    <td style="padding:0;"><b>Notes:</b></td>
                </tr>
                <tr>
                    <td style="width:100%;word-break:break-all;padding:0;">Notes-</td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    <tr>
            <td colSpan="5">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h3>Attachments</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>#ATTACHMENTS#</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
</tbody>
</table>
</div>
        </div>
    );
};

export default PdfContent;