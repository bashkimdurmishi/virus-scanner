import React, { useState } from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ProgressBar from '../components/progressbar/ProgressBar';
import Countdown from 'react-countdown';

import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css';


function File() {
    const [fileId, setFileId] = useState("");
    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [refresh, setRefresh] = useState(false);
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
    
    const onDrop = (file) => {
        setData(null);
        setLoading(true);

        let formData = new FormData();
        formData.append("file", file);

        instance.post(`/files`, formData).then(response => {
            if (response.status >= 200 || response.status <= 299){
                setFileId(response.data.data.id);
                getAnalasisResult(response.data.data.id);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const getAnalasisResult = (scannedFileId) => {
        instance.get(`/analyses/${scannedFileId}`).then(response => {
            if (response.status >= 200 || response.status <= 299){
                if(response.data.data.attributes.status === "queued") {
                    setRefresh(true);
                    setLoading(false);
                } else {
                    let stats = response.data.data.attributes.stats;
                    // Sum of the results (harmless, malicius, suspicious, etc)
                    stats.sum = Object.values(stats).reduce((a,b) => a+b, 0);

                    setStats(stats);
                    setData(response.data.data);
                    setLoading(false);
                }
                return response.data;
            }
        }).catch(err => {
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
    
    const renderAnalysing = () => {
        return (
            <TableRow key={"analysing-data"}>
                <TableCell component="td" colSpan={3} scope="row">Analysing file... File is in queue, please wait and press the refresh button after 10 seconds.</TableCell>
            </TableRow>
        )
    }

    const renderData = () => {
        let tableRows = [];

        if(data) {
            for (const [key, value] of Object.entries(data.attributes.results)) {
                tableRows.push(
                    <TableRow key={key}>
                        <TableCell component="td" scope="row">
                            {key}
                        </TableCell>
                        <TableCell align="right">{value.category}</TableCell>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {refresh && renderAnalysing()}
                        {loading && renderLoading()}
                        {data && renderData()}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const Completionist = () => <button className="btn btn-primary mt-3" onClick={() => {getAnalasisResult(fileId); setRefresh(false);}}>Refresh</button>;

    return(
        <div className="main-section mx-3 position-relative">
            {stats && <ProgressBar
                key={"progressbar"}
                malicious={stats.malicious}
                scans={stats.sum}
                size={100}
                strokeWidth={10}
                circleTwoStroke="red"
            />}
            <h2>FILE SCAN</h2>
            <StyledDropZone onDrop={(file) => {onDrop(file)}} className="file-input text-white" style={{minHeight: '50px'}} />
            {refresh && (
            <h2 className="mt-2">
                <Countdown className="text-" date={Date.now() + 10000}>
                    <Completionist />
                </Countdown>
            </h2>)}
            {renderTable()}
        </div>
    )
}

export default File;