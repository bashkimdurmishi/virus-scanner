import React, { useState } from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ProgressBar from '../components/progressbar/ProgressBar';


function Home() {
    const [url, setUrl] = useState("");
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const baseUrl = "https://www.virustotal.com/api/v3";

    const instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })

    instance.defaults.headers.get['x-apikey'] = process.env.REACT_APP_VIRUS_TOTAL_KEY;
    instance.defaults.headers.post['x-apikey'] = process.env.REACT_APP_VIRUS_TOTAL_KEY;

    const handleSubmit = (e) => {
        setData(null);
        e.preventDefault();
        setLoading(true);
        var encodedUrl = btoa(url);
        encodedUrl = encodedUrl.split("=")[0];
        console.log(encodedUrl);
        instance.get(`/urls/${encodedUrl}`).then(response => {
            if (response.status >= 200 || response.status <= 299){
                let stats = response.data.data.attributes.last_analysis_stats;
                // Sum of the results (harmless, malicius, suspicious, etc)
                stats.sum = Object.values(stats).reduce((a,b) => a+b, 0);
                
                setLoading(false);
                setData(response.data.data);
                setStats(stats);
            }
        }).catch(err => {
            setLoading(false);
            setData("error");
            console.log(err);
        });
    }

    const renderLoading = () => {
        return (
            <TableRow key={"no-data"}>
                <TableCell component="td" colSpan={3} scope="row">Loading results...</TableCell>
            </TableRow>
        )
    }

    const renderData = () => {
        let tableRows = [];

        if(data) {
            for (const [key, value] of Object.entries(data.attributes.last_analysis_results)) {
                tableRows.push(
                    <TableRow key={key}>
                        <TableCell component="td" scope="row">
                            {key}
                        </TableCell>
                        <TableCell align="right">{value.category}</TableCell>
                        <TableCell align="right">{value.result}</TableCell>
                    </TableRow>
                )
            }
        }
        return tableRows;
    }

    const renderTable = () => {
        return (
            <TableContainer className="mt-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Engine</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && renderLoading()}
                        {data && renderData()}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return(
        <div className="main-section mx-3">
            {stats && <ProgressBar
                className="align-self-start"
                key={"progressbar"}
                malicious={stats.malicious}
                scans={stats.sum}
                size={100}
                strokeWidth={10}
                circleTwoStroke="red"
            />}
            <div className="d-flex flex-column align-items-center">
                <h2>URL SCAN</h2>
                <form className="d-flex" onSubmit={(e) => {handleSubmit(e)}}>
                    <input className="form-control" type="text" value={url} placeholder="Eg: google.com" onChange={(e) => {
                        setUrl(e.target.value);
                        }} />
                    <button className="btn btn-primary mx-2">Scan</button>
                </form>
            </div> 
            {renderTable()}
        </div>
    )
}

export default Home;