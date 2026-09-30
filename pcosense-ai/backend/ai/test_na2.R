suppressPackageStartupMessages(library(randomForest))
obj <- readRDS("E:/Suraj ICMR/ICMR-demo/pcosense-ai/backend/ai/rf_model_new.rds")
m1 <- obj$Dataset1_RF
pnames <- names(m1$forest$ncat)
test_df <- as.data.frame(matrix(1, nrow=1, ncol=length(pnames)))
names(test_df) <- pnames
test_df$AMH.ng.mL. <- NA
res <- predict(m1, newdata=test_df, type="prob")
print(res)
print(dim(res))
