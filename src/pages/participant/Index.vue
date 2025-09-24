<template>
  <div>
    <!-- 🔹 참여자 목록 (모달 밖) -->
    <v-card class="mb-4">
      <v-card-title>참여자 목록</v-card-title>
      <v-list dense>
        <v-list-item v-for="user in participants" :key="user.userId">
          <v-list-item-title>
            {{ user.name || user.userId }} / {{ user.email || user.userId }} / ({{ user.roleName }})
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="participants.length === 0">
          <v-list-item-title class="text-grey"> 참여자가 없습니다. </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 🔹 초대발송 버튼 & 모달 -->
    <v-btn color="primary" @click="openDialog">초대발송</v-btn>

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
  </div>
</template>

<script>
import { useAuthStore } from '../stores/authStore';
import apiClient from '@/apis/apiClient';

export default {
  name: 'InviteDialog',
  props: {
    channel: {
      type: Object,
      required: false,
      default: () => ({ name: '', subject: '' }),
    },
  },
  data() {
    return {
      dialog: false,
      selectedRoleId: null,
      invitationCode: null,
      participants: [], // 참여자 목록
      roles: [
        { id: 2, name: '학생' },
        { id: 3, name: '학부모' },
      ],
    };
  },
  async mounted() {
    await this.fetchParticipants(); // 페이지 들어올 때 목록 불러오기
  },
  mounted() {
    this.fetchParticipants();
  },
  methods: {
    async openDialog() {
      this.dialog = true;
    },

    async fetchParticipants() {
      try {
        const channelId = this.$route.params.channelId;
        const res = await apiClient.get(`/channels/${channelId}/participants`);
        this.participants = res.data?.data || [];
        console.log('참여자 목록:', this.participants);
      } catch (err) {
        console.error('참여자 목록 불러오기 실패:', err);
      }
    },

    async sendInvitation() {
      try {
        const authStore = useAuthStore();
        const channelId = this.$route.params.channelId;

        const result = await authStore.sendInvitation(channelId, this.selectedRoleId);
        console.log('초대 발송 성공', result);

        if (result?.data?.[0]?.invitationCode) {
          this.invitationCode = result.data[0].invitationCode;
        }

        this.selectedRoleId = null;
        await this.fetchParticipants(); // 갱신
      } catch (err) {
        console.error(err);
      }
    },
    closeDialog() {
      this.dialog = false;
      this.invitationCode = null;
    },
  },

  async sendInvitation() {
    try {
      const authStore = useAuthStore();
      const channelId = this.$route.params.channelId;

      const result = await authStore.sendInvitation(channelId, this.selectedRoleId);
      console.log('초대 발송 성공', result);

      if (result?.data?.[0]?.invitationCode) {
        this.invitationCode = result.data[0].invitationCode;
      }

      this.selectedRoleId = null;
      await this.fetchParticipants(); // 초대 후 참여자 목록 갱신
    } catch (err) {
      console.error(err);
    }
  },
  closeDialog() {
    this.dialog = false;
    this.invitationCode = null;
  },
};
</script>
