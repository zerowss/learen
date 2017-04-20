var dataContrl = {
    /*获取这个id下的所有子数据*/
    getChildById : function (arr,id) {
        var newArr = [];
        arr.forEach(function (item) {
            if(item.pid == id){
                newArr.push(item);
            }
        });
        return newArr;
    },
    /*获取当前id的所有父级*/
    getParents : function (data,currentId) {
        var arr = [];
        data.forEach(function (item,i) {
            if(item.id == currentId){
                arr.push(item);
                arr = arr.concat(dataContrl.getParents(data,item.pid));
            }
        });
        return arr;
    },
    /*找到当前id的数据*/
    getParentsData : function (data,id) {
        var arr = [];
        data.forEach(function (item) {
            if(item.id == id){
                arr.push(item);
            }
        });
        return arr;
    },
    /*获取当前id的上一级父级*/
    getOneParents : function (data,currentId) {
        var arr = [];
        data.forEach(function (item,i) {
            if(item.id == currentId){
                arr.push(item);
            }
        });
        return arr;
    },
    /*删除当前id数据*/
    delChild : function (data,id) {
        for(i = 0;i<data.length;i++){
            if(data[i].id == id){
                data.splice(i,1);
                i--;
            }
        }
        return data;
    },
    /*获取当前id在第几级*/
    getLeaveById : function (data,id) {
        return dataContrl.getParents(data,id).length;
    },
    /*这个id是否有子元素*/
    hasChilds : function (data,id) {
        if(dataContrl.getChildById(data,id).length != 0){
            return true;
        }else{
            return false;
        }
    }
};
