import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

interface TableComponentProps {
  data: string[] | number[];
  rows: any[];
  title: string;
  columns: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data, rows, title, columns, rowId}) => {

  console.log(rows)
  
  return (
    <Box>
      <Typography
        variant='h3'
        component={'h3'}
        sx={{textAlign: "center", mt:3, mb:3}}
      >
        {title}
      </Typography>
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={rows=>"ID:"+rows.id}
      />
      
    </Box>
  );
};

export default TableComponent;