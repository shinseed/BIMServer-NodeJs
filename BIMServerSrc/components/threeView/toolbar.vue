

<template>

<div>
    <div :style="container">
        <el-button :type="menuType" @click="handleMenuClick" icon="menu" size="mini"></el-button>
        <div v-show="menuEnable">
            ---
            <el-button type="primary" @click="ResetCamera" icon="caret-top" size="mini">镜头重置</el-button>
            <el-button type="primary" @click="VisibleSelectModels" icon="star-on" size="mini">影藏选中模型</el-button>
            <el-button type="primary" @click="ShowSelectModels" icon="star-off" size="mini">显示已影藏模型</el-button>
            <el-button :type="follow.btnCss" @click="EnableFollow" :icon="follow.iconCss" size="mini">镜头是否跟随</el-button>
        </div>
        <div :style="processContainer">
            <span>{{loadText}}</span>
        </div>
    </div>
    <canvas></canvas>

</div>

</template>

<script>

export default {
    props: {
        width: Number,
        loadText: String
    },
    methods: {
        handleMenuClick(e) {
                e.target.blur(); //可能点中icon
                e.target.parentElement.blur();
                this.menuEnable = !this.menuEnable;
                this.menuEnable ? this.menuType = '' : this.menuType = 'success';
            },
            ResetCamera() {
                this.$parent.ResetCamera(); //不ob Three 实体
            },
            VisibleSelectModels() {
                this.$parent.VisibleSelectModels(); //不ob Three 实体
            },
            ShowSelectModels() {
                this.$parent.ShowSelectModels(); //不ob Three 实体
            },
            EnableFollow(e) {
                e.target.blur(); //可能点中icon
                e.target.parentElement.blur();
                this.follow.isFollow = !this.follow.isFollow;
                if (this.follow.isFollow) {
                    this.follow.iconCss = 'circle-check';
                    this.follow.btnCss = 'primary';
                } else {
                    this.follow.iconCss = 'circle-close';
                    this.follow.btnCss = '';
                }
                this.$parent.EnableFollow(); //不ob Three 实体
            }
    },
    data() {
        return {
            container: {
                position: 'fixed',
                'text-align': 'left',
                width: this.width + 'px',
                display: 'inline-flex'
            },
            processContainer:{
                position: 'fixed',
                'text-align': 'center',
                    width: this.width + 'px',
            },
            follow: {
                btnCss: 'primary',
                iconCss: 'circle-check',
                isFollow: true
            },
            menuType: 'success',
            menuEnable: false
        }
    }
}
// <div>

//
//
//

//        <div style={{position:'fixed','text-align':'left','margin-top':'25px'}}>
//        </div>
//        <canvas></canvas>
//
//      </div>

</script>
