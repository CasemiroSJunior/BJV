import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from "@mui/material";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

interface TableComponentProps {
  data: string[] | number[];
  rows: any[];
  title: string;
  columns: any[];
}

const TableComponent: React.FC<TableComponentProps> = ({ data, rows, title, columns}) => {

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
        pageSizeOptions={[5,10,25,50,100]}
        columns={columns}
        rows={rows}
        getRowId={rows=>"ID:"+rows.id}
        slots={{ toolbar: GridToolbar}}
      />
      
    </Box>
  );
};

export default TableComponent;