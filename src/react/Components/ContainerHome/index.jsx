import styles from './containerhome.module.css'

function ContainerHome({children}){
    return(
<section className={styles.containerhome}>
    {children}

</section>
    )

}
export default ContainerHome