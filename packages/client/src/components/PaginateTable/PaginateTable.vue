<template>
    <div class="app-paginate-table" v-loading="loading">
        <el-table border fit height="500" show-header stripe :data="localData">
            <el-table-column
                v-for="field in fieldList"
                :prop="field"
                :key="field"
                :label="fields[field]"
                :formatter="formatter[field]"
            />
        </el-table>
        <el-pagination
            background
            :current-page="page"
            :page-size="limit"
            :page-count="totalPage"
            @current-change="handlePageChange.bind(this)"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { axiosInstance } from "@/utils/axios";

@Component({
    name: "app-paginate-table",
})
export default class PaginateTable extends Vue {
    @Prop({ required: true, type: String }) api_url!: string;
    @Prop({ required: false, type: Object, default: () => ({}) })
    queries!: Record<string, string | number>;
    @Prop({ required: false, type: Object, default: () => [] }) fields!: any;
    @Prop({ required: false, type: Object, default: () => ({}) })
    formatter!: Record<string, (value: any) => any>;

    localData: any[] = [];
    page = 1;
    limit = 20;
    totalPage = 1;

    loading = true;

    get fieldList(): string[] {
        return Object.keys(this.fields);
    }

    handlePageChange(page: number) {
        this.fetchData(page, this.limit);
    }

    @Watch("queries")
    onQueryChange() {
        this.fetchData(this.page, this.limit);
    }

    fetchData(page = 1, limit = 20) {
        this.loading = true;
        axiosInstance
            .get<Paginate>(this.api_url, {
                params: {
                    ...this.queries,
                    page,
                    limit,
                },
            })
            .then(({ data }) => {
                this.localData = data.items;
                this.totalPage = data.meta.totalPages;
                this.page = data.meta.currentPage;
            })
            .finally(() => {
                this.loading = false;
            });
    }

    mounted() {
        this.fetchData(this.page, this.limit);
    }
}
</script>

<style lang="scss"></style>
