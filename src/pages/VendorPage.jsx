import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getBaseUrl } from "../models/utils";
import Loading from "../components/Loading";

function VendorPage() {
    const { id } = useParams();
    return(
        <div>
            <h1>Vendor Page</h1>
            <p>Vendor ID: {id}</p>
        </div>
    )
}

export default VendorPage;