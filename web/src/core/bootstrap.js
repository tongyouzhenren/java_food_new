// localStorage恢复到内存

import {useUserStore} from "/@/store";
import { usePermissionStore } from '/@/store/modules/permission';
import {
  USER_ID,
  USER_NAME,
  USER_TOKEN,
  USER_ROLES,
  USER_PERMISSIONS,
  ADMIN_USER_ID,
  ADMIN_USER_NAME,
  ADMIN_USER_TOKEN
} from "/@/store/constants";

export default function Initializer () {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const cachedRoles = localStorage.getItem(USER_ROLES)
  const cachedPermissions = localStorage.getItem(USER_PERMISSIONS)
  userStore.$patch((state)=>{
    state.user_id = localStorage.getItem(USER_ID)
    state.user_name = localStorage.getItem(USER_NAME)
    state.user_token = localStorage.getItem(USER_TOKEN)
    state.roles = cachedRoles ? JSON.parse(cachedRoles) : []
    state.permissions = cachedPermissions ? JSON.parse(cachedPermissions) : []

    state.admin_user_id = localStorage.getItem(ADMIN_USER_ID)
    state.admin_user_name = localStorage.getItem(ADMIN_USER_NAME)
    state.admin_user_token = localStorage.getItem(ADMIN_USER_TOKEN)
    console.log('恢复store完毕==>', state)
  })

  permissionStore.syncFromUser({
    roles: cachedRoles ? JSON.parse(cachedRoles) : [],
    permissions: cachedPermissions ? JSON.parse(cachedPermissions) : [],
  })

}
