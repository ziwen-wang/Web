// 删除相同项
function array_diff(a, b) {
    for(var i=0;i<b.length;i++)  
    {  
      for(var j=0;j<a.length;j++)  
      {  
        if(a[j]==b[i]){  
          a.splice(j,1);  
          j=j-1;  
        }  
      }  
    }   
  return a;  
}  