

<template>

<el-table :data="tabledata" ref="treeTable" border style="width: 100%">
    <el-table-tree-column fixed :remote="remote" file-icon="icon icon-file" folder-icon="icon icon-folder" prop="label" label="工程名" class-name="123" header-align="center">
    </el-table-tree-column>
    <el-table-column prop="description" label="描述" :show-overflow-tooltip="true"></el-table-column>
    <el-table-column fixed="right" label="操作" width="200">
        <template scope="scope">
            <el-button @click="handleClick" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" @click='handleRemoveClick(scope.row,scope.$index)' size="small">删除</el-button>
        </template>
    </el-table-column>
</el-table>

</template>

<script>

import util from '~/components/eleme-tree-grid/util';

var trees = [{
    "id": 1,
    "label": "System",
    "parent_id": null,
    "url": null,
    "depth": 0,
    "child_num": 1,
    "description": "System Manager",
    "children": [{
        "id": 2,
        "label": "base",
        "parent_id": 1,
        "url": null,
        "depth": 1,
        "child_num": 3,
        "description": "Base Manager",
        "expanded": true,
        "children": [{
            "id": 3,
            "label": "Menus",
            "parent_id": 2,
            "url": "/menus",
            "depth": 2,
            "child_num": 0,
            "description": "menu manager",
        }, {
            "id": 4,
            "label": "Roles",
            "parent_id": 2,
            "url": "/roles",
            "depth": 2,
            "child_num": 0,
            "description": "Role Manager",
        }, {
            "id": 5,
            "label": "Users",
            "parent_id": 2,
            "url": "/users",
            "depth": 2,
            "child_num": 0,
            "description": "User Manager",
        }]
    }]
}, {
    "id": 6,
    "label": "Customs",
    "parent_id": null,
    "url": null,
    "depth": 0,
    "child_num": 1,
    "description": "Custom Manager",
    "children": [{
        "id": 7,
        "label": "CustomList",
        "parent_id": 6,
        "url": "/customs",
        "depth": 1,
        "child_num": 0,
        "description": "CustomList",
    }]
}, {
    "id": 8,
    "label": "Templates",
    "parent_id": null,
    "url": null,
    "depth": 0,
    "child_num": 1,
    "description": "Template Manager",
    "children": [{
        "id": 9,
        "label": "TemplateList",
        "parent_id": 8,
        "url": "/doc_templates",
        "depth": 1,
        "child_num": 0,
        "description": "Template Manager",
    }]
}, {
    "id": 10,
    "label": "Bussiness",
    "parent_id": null,
    "url": null,
    "depth": 0,
    "child_num": 2,
    "description": "Bussiness Manager",
    "expanded": false,
    "children": [{
        "id": 11,
        "label": "BussinessList",
        "parent_id": 10,
        "url": null,
        "depth": 1,
        "child_num": 2,
        "description": "BussinessList",
        "children": [{
            "id": 12,
            "label": "Currencies",
            "parent_id": 11,
            "url": "/currencies",
            "depth": 2,
            "child_num": 0,
            "description": "Currencies",
        }, {
            "id": 13,
            "label": "Dealtypes",
            "parent_id": 11,
            "url": "/dealtypes",
            "depth": 2,
            "child_num": 0,
            "description": "Dealtypes",
        }]
    }, {
        "id": 14,
        "label": "Products",
        "parent_id": 10,
        "url": null,
        "depth": 1,
        "child_num": 2,
        "description": "Products",
        "children": [{
            "id": 15,
            "label": "ProductTypes",
            "parent_id": 14,
            "url": "/productTypes",
            "depth": 2,
            "child_num": 0,
            "description": "ProductTypes",
        }, {
            "id": 16,
            "label": "ProductList",
            "parent_id": 14,
            "url": "/products",
            "depth": 2,
            "child_num": 0,
            "description": "ProductList",
        }]
    }]
}]

export default {
    methods: {
        handleClick() {
                console.log(1);
            },
            remote(row, callback) {
                setTimeout(function() {
                    callback(row.children)
                }, 500)
            },
            formatter(row, column) {
                return ' ---  ' + row.label;
            },
            handleRemoveClick(row, index) {

                if (row.child_num > 0) {
                    this.$message({
                        title: '警告',
                        message: '有子数据不能删除',
                        type: 'warning'
                    });
                    return;
                }

                this.$refs.treeTable.tableData.forEach((item, index) => {
                    if (item.id === row.parent_id) {
                        item.child_num--;
                    }
                })

                this.$refs.treeTable.tableData.splice(index, 1);

                this.$message({
                    title: '成功',
                    message: '删除成功',
                    type: 'success'
                });

            }
    },

    data() {
        return {
            tabledata: trees
        }

    }
}

</script>
