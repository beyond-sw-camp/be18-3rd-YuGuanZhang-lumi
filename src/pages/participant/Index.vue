<template>
  <div>
    <!-- 🔹 참여자 목록 -->
    <v-card class="mb-4">
      <v-card-title>참여자 목록</v-card-title>
      <v-list dense>
        <v-list-item v-for="user in participants" :key="user.userId">
          <v-row class="w-100" align="center">
            <!-- 텍스트 영역 -->
            <v-col>
              {{ user.name || user.userId }} / {{ user.email || user.userId }} / ({{
                user.roleName
              }})
            </v-col>

            <!-- 버튼 영역: 로그인한 사용자만 -->
            <v-col
              class="d-flex justify-end"
              cols="auto"
              v-if="user.userId === authStore.tokenInfo.userId && user.roleName !== 'TUTOR'"
            >
              <v-btn small color="#eeddff" @click="openUserInfo(user)">정보</v-btn>
              <v-btn small color="#eeddff" @click="handleAction(user)">탈퇴</v-btn>
            </v-col>
          </v-row>
        </v-list-item>

        <v-list-item v-if="participants.length === 0">
          <v-list-item-title class="text-grey"> 참여자가 없습니다. </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 🔹 초대발송 버튼 & 모달 -->
    <v-btn color="#eeddff" @click="openDialog">초대발송</v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          {{ channel?.name || '초대 발송' }}
        </v-card-title>

        <v-divider class="my-2" />

        <!-- 발송 성공 후 코드 보여주기 -->
        <div v-if="invitationCode" class="pa-4">
          <p class="text-subtitle-1">
            ✅ 초대 코드:
            <strong>
              {{ invitationCode }}<br />
              유효기간 7일입니다.
            </strong>
          </p>
        </div>

        <!-- 발송 전일 때만 역할 선택 보이도록 -->
        <div v-else>
          <v-select
            v-model="selectedRoleId"
            :items="roles"
            item-title="name"
            item-value="id"
            label="역할 선택"
            outlined
            hide-details
          />
        </div>

        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">닫기</v-btn>
          <v-btn
            v-if="!invitationCode"
            color="primary"
            :disabled="!selectedRoleId"
            @click="sendInvitation"
          >
            발송
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 🔹 참여자 정보 모달 (조회 전용) -->
    <ChannelUserInfoModal
      :visible="userInfoDialog"
      :userId="selectedUserId"
      :channelId="channel?.id || $route.params.channelId"
      @close="userInfoDialog = false"
    />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import ChannelUserInfoModal from '../channel/components/ChannelUserInfoModal.vue';

export default {
  name: 'InviteDialog',
  components: { ChannelUserInfoModal },
  props: {
    channel: {
      type: Object,
      required: false,
      default: () => ({ name: '', subject: '' }),
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      dialog: false,
      selectedRoleId: null,
      invitationCode: null,
      participants: [],
      roles: [
        { id: 2, name: '학생' },
        { id: 3, name: '학부모' },
      ],
      // InfoDialog 제어용 상태
      userInfoDialog: false,
      selectedUserId: null,
    };
  },
  async mounted() {
    await this.loadParticipants();
  },
  methods: {
    async openDialog() {
      this.dialog = true;
    },
    async loadParticipants() {
      try {
        const channelId = this.$route.params.channelId;
        this.participants = await this.authStore.fetchParticipants(channelId);
      } catch (err) {
        console.error(err);
      }
    },
    async sendInvitation() {
      try {
        const channelId = this.$route.params.channelId;
        const result = await this.authStore.sendInvitation(channelId, this.selectedRoleId);

        if (result?.data?.[0]?.invitationCode) {
          this.invitationCode = result.data[0].invitationCode;
        }

        this.selectedRoleId = null;
        await this.loadParticipants();
      } catch (err) {
        console.error(err);
      }
    },
    closeDialog() {
      this.dialog = false;
      this.invitationCode = null;
    },
    async handleAction(user) {
      try {
        if (user.userId !== this.authStore.tokenInfo.userId) return;

        const channelId = this.$route.params.channelId;
        const response = await this.authStore.deleteSelfFromChannel(channelId);
        console.log('참여자 삭제 성공:', response);

        await this.loadParticipants();
      } catch (err) {
        console.error('참여자 삭제 실패:', err);
      }
    },
    openUserInfo(user) {
      this.selectedUserId = Array.isArray(user.userId) ? user.userId[0] : user.userId;
      this.userInfoDialog = true;
    },
  },
};
</script>
